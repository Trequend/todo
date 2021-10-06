import { configureStore } from '@reduxjs/toolkit';
import { todosReducer } from 'src/features/todos/slice';
import { userReducer } from 'src/features/user/slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
