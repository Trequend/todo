import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiError from '../errors/ApiError';

export default function createApiThunk<Params, Result>(
  sliceName: string,
  thunkName: string,
  api: (params: Params) => Promise<Result>
) {
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
