import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import ApiError from '../errors/ApiError';

function createApiTask<Result, Params = void>(
  sliceName: string,
  thunkName: string,
  api: (params: Params) => Promise<Result>
): AsyncThunk<Result, Params, {}> {
  return createAsyncThunk(
    `${sliceName}/${thunkName}`,
    async (params: Params) => {
      try {
        const result = await api(params);
        return result;
      } catch (error) {
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

export default createApiTask;
