import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError } from 'src/errors';
import { ApiFunction } from './createApiFunction';

export type TaskArgs<Params, Result> = {
  canAbort?: (params: Params) => boolean;
  onFulfill?: (result: Result) => void;
  onReject?: (error: unknown) => void;
  onAbort?: () => void;
  params: Params;
};

export function createApiTask<Result>(
  sliceName: string,
  thunkName: string,
  api: ApiFunction<void, Result>
): AsyncThunk<Result, Partial<TaskArgs<void, Result>> | undefined, {}>;

export function createApiTask<Result, Params>(
  sliceName: string,
  thunkName: string,
  api: ApiFunction<Params, Result>
): AsyncThunk<Result, TaskArgs<Params, Result>, {}>;

export function createApiTask<Result, Params = void>(
  sliceName: string,
  thunkName: string,
  api: ApiFunction<Params, Result>
): AsyncThunk<Result, any, {}> {
  const requests = new Map<AbortController, (params: Params) => boolean>();

  const abortRequests = (params: Params) => {
    const controllers: Array<AbortController> = [];
    requests.forEach((canAbort, controller) => {
      if (canAbort(params)) {
        controllers.push(controller);
      }
    });

    for (const controller of controllers) {
      controller.abort();
    }
  };

  return createAsyncThunk(
    `${sliceName}/${thunkName}`,
    async (args: TaskArgs<Params, Result>) => {
      const { canAbort, onFulfill, onReject, onAbort, params } = args ?? {};

      let abortController: AbortController | undefined;
      try {
        abortRequests(params);
        if (canAbort) {
          abortController = new AbortController();
          requests.set(abortController, canAbort);
        }

        const result = await api({ signal: abortController?.signal, params });
        onFulfill && onFulfill(result);
        return result;
      } catch (error) {
        if (error && (error as any).name === 'AbortError') {
          onAbort && onAbort();
          throw error;
        } else {
          onReject && onReject(error);
        }

        if (error instanceof ApiError) {
          throw error;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error(error);
          }

          throw new ApiError('Unknown error');
        }
      } finally {
        if (abortController) {
          requests.delete(abortController);
        }
      }
    }
  );
}
