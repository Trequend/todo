import { createSlice } from '@reduxjs/toolkit';
import User from '../../types/User';
import addSseEventsListeners from '../../utils/addSseEventsListeners';
import addTaskHandler, { WithTask } from '../../utils/addTaskHandler';
import createApiTask from '../../utils/createApiTask';
import createSseConnectionTasks from '../../utils/createSseConnectionTasks';
import * as api from './api';

type State = {
  id?: string;
  data?: User;
} & WithTask<'fetch'> &
  WithTask<'connect'> &
  WithTask<'signIn'> &
  WithTask<'signUp'> &
  WithTask<'logout'>;

const SLICE_NAME = 'user';

export const userInitialState: State = {};

const { eventsPrefix, connect, disconnect } = createSseConnectionTasks(
  SLICE_NAME,
  'user',
  {
    endpoint: '/user/sse',
    sseEvents: ['init', 'error', 'open'],
    connectionOptions: {
      withCredentials: true,
      withCSRFToken: true,
    },
  }
);

const tasks = {
  connect,
  disconnect,
  fetchUser: createApiTask(SLICE_NAME, 'fetchUser', api.fetchUser),
  signIn: createApiTask(SLICE_NAME, 'signIn', api.signIn),
  signUp: createApiTask(SLICE_NAME, 'signUp', api.signUp),
  logout: createApiTask(SLICE_NAME, 'logout', api.logout),
};

const slice = createSlice({
  name: SLICE_NAME,
  initialState: userInitialState,
  reducers: {
    removeSignInError: (state) => {
      state.signInError = undefined;
    },
    removeSignUpError: (state) => {
      state.signUpError = undefined;
    },
    removeLogoutError: (state) => {
      state.logoutError = undefined;
    },
  },
  extraReducers: (builder) => {
    addTaskHandler('fetch', builder, tasks.fetchUser, {
      onFulfill(state, { payload: user }) {
        state.data = user;
      },
    });

    addTaskHandler('connect', builder, tasks.connect);

    addTaskHandler('signIn', builder, tasks.signIn, {
      onFulfill(state, { payload: id }) {
        state.id = id;
      },
    });

    addTaskHandler('signUp', builder, tasks.signUp);

    addTaskHandler('logout', builder, tasks.logout);

    addSseEventsListeners(eventsPrefix, builder, {
      listeners: {
        open: (state) => {
          state.connectError = undefined;
        },
        init: (state, { data }) => {
          state.data = data;
        },
        error: (state) => {
          state.connectError = 'Connection lost';
        },
      },
    });
  },
});

export const userActions = Object.freeze({
  ...tasks,
  ...slice.actions,
});

export const userReducer = slice.reducer;
