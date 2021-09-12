import { configureStore } from '@reduxjs/toolkit';
import { userReducer, userInitialState } from '../features/user/slice';
import persistentStore from './persistentStore';

const USER_ID = 'user.id';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: {
      ...userInitialState,
      id: persistentStore.getItem(USER_ID),
    },
  },
});

store.subscribe(() => {
  const state = store.getState();

  persistentStore.setItem(USER_ID, state.user.id);
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;

export default store;
