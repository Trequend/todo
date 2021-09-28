import { configureStore } from '@reduxjs/toolkit';
import { todosReducer } from '../features/todos/slice';
import { userReducer } from '../features/user/slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
