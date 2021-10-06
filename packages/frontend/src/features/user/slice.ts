import { createSlice } from '@reduxjs/toolkit';
import { User, WithTask } from 'src/types';
import {
  addSseEventsListeners,
  addTaskHandler,
  createApiTask,
  createSseConnectionTasks,
} from 'src/utils';
import * as api from './api';

type State = {
  data?: User;
} & WithTask<'fetch'> &
  WithTask<'connect'> &
  WithTask<'signIn'> &
  WithTask<'signUp'> &
  WithTask<'logout'> &
  WithTask<'changeAvatar'> &
  WithTask<'deleteAvatar'> &
  WithTask<'changeUser'> &
  WithTask<'changePassword'>;

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
  changeAvatar: createApiTask(SLICE_NAME, 'changeAvatar', api.changeAvatar),
  deleteAvatar: createApiTask(SLICE_NAME, 'deleteAvatar', api.deleteAvatar),
  changeUser: createApiTask(SLICE_NAME, 'changeUser', api.changeUser),
  changePassword: createApiTask(
    SLICE_NAME,
    'changePassword',
    api.changePassword
  ),
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

    addTaskHandler('signIn', builder, tasks.signIn);

    addTaskHandler('signUp', builder, tasks.signUp);

    addTaskHandler('logout', builder, tasks.logout);

    addTaskHandler('changeAvatar', builder, tasks.changeAvatar, {
      onFulfill(state, { payload: avatarId }) {
        if (state.data) {
          state.data.avatarId = avatarId ?? null;
        }
      },
    });

    addTaskHandler('deleteAvatar', builder, tasks.deleteAvatar, {
      onFulfill(state) {
        if (state.data) {
          state.data.avatarId = null;
        }
      },
    });

    addTaskHandler('changeUser', builder, tasks.changeUser, {
      onFulfill(state, { payload: user }) {
        state.data = user;
      },
    });

    addTaskHandler('changePassword', builder, tasks.changePassword);

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
