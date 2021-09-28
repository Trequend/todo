import { EventSourcePolyfill } from 'event-source-polyfill';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { getCookie } from '../utils/getCookie';

const connections = new Map<object, EventSource>();

export type SseConnectOptions<T = any> = {
  lastEventIdQueryParameterName?: string;
  withCredentials?: boolean;
  withCSRFToken?: boolean;
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  listeners?: {
    [type in 'message' | string]: (event: MessageEvent<T>) => void;
  };
};

async function connect<T = any>(
  endpoint: string,
  {
    lastEventIdQueryParameterName,
    withCredentials,
    withCSRFToken,
    onError,
    onOpen,
    listeners = {},
  }: SseConnectOptions<T>
) {
  const onMessage = listeners['message'];
  const url = endpoint.startsWith('/')
    ? `${process.env.REACT_APP_API_URL}${endpoint}`
    : endpoint;

  return await new Promise<object>((resolve, reject) => {
    const key = {};
    const headers = withCSRFToken
      ? {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        }
      : undefined;

    const connection = new EventSourcePolyfill(url, {
      withCredentials,
      headers,
      lastEventIdQueryParameterName,
    }) as EventSource;

    connection.addEventListener('open', (event) => {
      connections.set(key, connection);
      onOpen && onOpen(event);
      resolve(key);
    });

    connection.addEventListener('error', (event) => {
      if (!connections.get(key)) {
        if ((event as any).status === 401) {
          reject(new UnauthorizedError());
        } else {
          reject(new Error(`Failed to connect to "${url}"`));
        }
      } else {
        onError && onError(event);
      }
    });

    connection.addEventListener('message', (event) => {
      onMessage && onMessage(event as MessageEvent<T>);
    });

    Object.entries(listeners).forEach(([type, listener]) => {
      if (['open', 'error', 'message'].includes(type)) {
        return;
      }

      connection.addEventListener(type, (event) => {
        listener(event as MessageEvent<T>);
      });
    });
  });
}

function disconnect(key: any) {
  const connection = connections.get(key);
  if (!connection) {
    return;
  }

  connections.delete(key);
  connection.close();
}

export const sse = Object.freeze({
  connect,
  disconnect,
});
