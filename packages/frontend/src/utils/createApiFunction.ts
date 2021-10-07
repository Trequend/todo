import { fetchApi as originFetchApi } from './fetchApi';

export type ApiParams<Params> = {
  signal?: AbortSignal;
  params: Params;
};

type FetchApi = typeof originFetchApi;

export type ApiFunctionCallback<Params, Result> = (
  fetchApi: FetchApi,
  params: Params
) => Promise<Result>;

export type ApiFunction<Params, Result> = (
  params: ApiParams<Params>
) => Promise<Result>;

export function createApiFunction<Result, Params = void>(
  apiFunction: ApiFunctionCallback<Params, Result>
): ApiFunction<Params, Result> {
  return ({ signal, params }: ApiParams<Params>) => {
    const fetchApi: FetchApi = (input, init) => {
      return originFetchApi(input, { ...init, signal });
    };

    return apiFunction(fetchApi, params);
  };
}
