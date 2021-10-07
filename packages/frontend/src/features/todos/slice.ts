import { createSlice } from '@reduxjs/toolkit';
import { Todo, WithTask } from 'src/types';
import {
  addSseEventsListeners,
  addTaskHandler,
  arrayToObject,
  createApiTask,
  createSseConnectionTasks,
} from 'src/utils';
import * as api from './api';

type State = {
  list: Record<
    string,
    Omit<Todo, 'id'> & WithTask<'change'> & WithTask<'delete'>
  >;
  hiddenTodos: Record<string, boolean>;
} & WithTask<'fetch'> &
  WithTask<'connect'> &
  WithTask<'create'>;

const SLICE_NAME = 'todos';

export const todosInitialState: State = {
  list: {},
  hiddenTodos: {},
};

const { eventsPrefix, connect, disconnect } = createSseConnectionTasks(
  SLICE_NAME,
  'todos',
  {
    endpoint: '/todos/sse',
    sseEvents: ['init', 'delete', 'error', 'open'],
    connectionOptions: {
      withCredentials: true,
      withCSRFToken: true,
    },
  }
);

const tasks = {
  connect,
  disconnect,
  fetchTodos: createApiTask(SLICE_NAME, 'fetch', api.fetchTodos),
  createTodo: createApiTask(SLICE_NAME, 'create', api.createTodo),
  changeTodo: createApiTask(SLICE_NAME, 'change', api.changeTodo),
  deleteTodo: createApiTask(SLICE_NAME, 'delete', api.deleteTodo),
};

const slice = createSlice({
  name: SLICE_NAME,
  initialState: todosInitialState,
  reducers: {
    changeTodoLocal(state, { payload }: { payload: api.ChangeTodoParams }) {
      const { id, ...rest } = payload;
      const todo = state.list[payload.id];
      state.list[payload.id] = {
        ...todo,
        ...rest,
      };
    },
    hideTodoLocal(state, { payload: id }: { payload: string }) {
      state.hiddenTodos[id] = true;
    },
    showTodoLocal(state, { payload: id }: { payload: string }) {
      delete state.hiddenTodos[id];
    },
  },
  extraReducers: (builder) => {
    addTaskHandler('fetch', builder, tasks.fetchTodos, {
      onFulfill(state, { payload: todos }) {
        state.list = arrayToObject(todos);
      },
    });

    addTaskHandler('connect', builder, tasks.connect);

    addTaskHandler('create', builder, tasks.createTodo);

    addTaskHandler('change', builder, tasks.changeTodo, {
      selector(state, { params }) {
        const { id } = params;
        return state.list[id];
      },
      onFulfill(state, { payload: todo }) {
        if (todo) {
          const { id, ...rest } = todo;
          state.list[id] = rest;
        }
      },
    });

    addTaskHandler('delete', builder, tasks.deleteTodo, {
      selector(state, { params }) {
        const { id } = params;
        return state.list[id];
      },
      onFulfill(state, { meta }) {
        const { id } = meta.arg.params;
        delete state.list[id];
      },
    });

    addSseEventsListeners(eventsPrefix, builder, {
      listeners: {
        init: (state, { data: todo }) => {
          state.list[todo.id] = {
            ...todo,
            id: undefined,
          };
        },
        delete: (state, { data }) => {
          if (data && data.id) {
            delete state.list[data.id];
          }
        },
        open: (state) => {
          state.connectError = undefined;
        },
        error: (state) => {
          state.connectError = 'Connection lost';
        },
      },
    });
  },
});

export const todosActions = {
  ...slice.actions,
  ...tasks,
};

export const todosReducer = slice.reducer;
