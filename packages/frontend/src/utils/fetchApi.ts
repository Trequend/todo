import ApiError from '../errors/ApiError';
import getCookie from './getCookie';
import resetApp from '../app/resetApp';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export default async function fetchApi(input: RequestInfo, init?: RequestInit) {
  const options = init ?? {};
  const apiPrefix = process.env.REACT_APP_API_URL ?? '';
  const response = await fetch(`${apiPrefix}${input}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
    },
    credentials: 'same-origin',
  });

  if (response.status === 401) {
    resetApp();
    throw new UnauthorizedError();
  } else if (!response.ok) {
    try {
      const json = await response.json();
      throw new ApiError(json.message ?? 'Unknown error');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError('Unknown error');
      }
    }
  }

  try {
    const json = await response.json();
    return json;
  } catch {
    return {};
  }
}
