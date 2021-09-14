import { createAsyncThunk } from '@reduxjs/toolkit';
import SseError from '../errors/SseError';
import { sse, SseConnectOptions } from '../features/sse';

function createSseConnectionTasks(
  sliceName: string,
  connectionName: string,
  options: {
    waitEvent?: string;
    sseEvents: Array<string>;
    endpoint: string;
    connectionOptions: Omit<SseConnectOptions, 'listeners'>;
  }
) {
  let key: object | undefined;

  const prefix = `${sliceName}/sse/${connectionName}`;
  const connectName = `${prefix}/connect`;
  const disconnectName = `${prefix}/disconnect`;
  const eventsPrefix = `${prefix}/event`;

  return {
    eventsPrefix,
    connect: createAsyncThunk(connectName, async (_, { dispatch }) => {
      await new Promise<void>(async (resolve, reject) => {
        const eventsListeners = createEventsListeners(
          options.waitEvent
            ? [options.waitEvent, ...options.sseEvents]
            : options.sseEvents,
          (eventName, data) => {
            console.log('Event: ', eventName);
            console.log('Data: ', data);
            const actionType = `${eventsPrefix}/${eventName}`;
            dispatch({ type: actionType, data });
            if (eventName === options.waitEvent) {
              resolve();
            }
          }
        );

        try {
          sse.disconnect(key);
          key = await sse.connect(options.endpoint, {
            ...options.connectionOptions,
            ...eventsListeners,
          });
          if (!options.waitEvent) {
            resolve();
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(error);
          }

          reject(new SseError('Unknown error'));
        }
      });
    }),
    disconnect: createAsyncThunk(disconnectName, () => {
      try {
        sse.disconnect(key);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }

        throw new SseError('Unknown error');
      }
    }),
  };
}

function createEventsListeners(
  sseEvents: Array<string>,
  onEvent: (name: string, data?: any) => void
) {
  const containsErrorEvent = sseEvents.includes('error');
  const containsOpenEvent = sseEvents.includes('open');

  const events = new Set<string>(['error', 'open']);

  const listeners = sseEvents
    .filter((eventName) => {
      if (events.has(eventName)) {
        return false;
      }

      events.add(eventName);
      return true;
    })
    .map((eventName): [string, any] => {
      return [
        eventName,
        (event: MessageEvent) => {
          console.log(eventName, event);
          onEvent(eventName, JSON.parse(event.data));
        },
      ];
    })
    .reduce((previousValue, [eventName, listener]) => {
      return {
        ...previousValue,
        [eventName]: listener,
      };
    }, {});

  console.log(listeners);

  return {
    onOpen: containsOpenEvent ? () => onEvent('open') : undefined,
    onError: containsErrorEvent ? () => onEvent('error') : undefined,
    listeners,
  };
}

export default createSseConnectionTasks;
