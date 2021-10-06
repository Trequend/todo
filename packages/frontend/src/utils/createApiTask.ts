import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError } from 'src/errors';

export type TaskArgs<Params, Result> = {
  onFulfill?: (result: Result) => void;
  onReject?: (error: unknown) => void;
  params: Params;
};

export function createApiTask<Result>(
  sliceName: string,
  thunkName: string,
  api: () => Promise<Result>
): AsyncThunk<Result, Partial<TaskArgs<void, Result>> | undefined, {}>;

export function createApiTask<Result, Params>(
  sliceName: string,
  thunkName: string,
  api: (params: Params) => Promise<Result>
): AsyncThunk<Result, TaskArgs<Params, Result>, {}>;

export function createApiTask<Result, Params = void>(
  sliceName: string,
  thunkName: string,
  api: (params: Params) => Promise<Result>
): AsyncThunk<Result, any, {}> {
  return createAsyncThunk(
    `${sliceName}/${thunkName}`,
    async (args: TaskArgs<Params, Result>) => {
      const { onFulfill, onReject, params } = args ?? {};
      try {
        const result = await api(params);
        onFulfill && onFulfill(result);
        return result;
      } catch (error) {
        onReject && onReject(error);
        if (error instanceof ApiError) {
          throw error;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error(error);
          }

          throw new ApiError('Unknown error');
        }
      }
    }
  );
}
