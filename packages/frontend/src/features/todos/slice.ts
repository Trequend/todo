import { createSlice } from '@reduxjs/toolkit';
import { Todo } from '../../types';
import { WithTask } from '../../utils/addTaskHandler';

type State = {
  list: Array<Todo & WithTask<'changeDone'> & WithTask<'delete'>>;
};

const SLICE_NAME = 'todos';

export const todosInitialState: State = {
  list: [],
};

const slice = createSlice({
  name: SLICE_NAME,
  initialState: todosInitialState,
  reducers: {},
});

export const todosActions = {
  ...slice.actions,
};

export const todosReducer = slice.reducer;
