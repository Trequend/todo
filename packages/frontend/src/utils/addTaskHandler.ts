import {
  ActionReducerMapBuilder,
  AsyncThunk,
  CaseReducer,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import { WithTask } from 'src/types';

type TaskReducer<
  State,
  ThunkArg,
  Returned,
  Status extends string
> = CaseReducer<
  State,
  PayloadAction<
    Returned | undefined,
    string,
    { arg: ThunkArg; requestId: string; requestStatus: Status },
    never
  >
>;

export function addTaskHandler<
  TaskName extends string,
  State,
  Returned,
  ThunkArg,
  Target extends WithTask<TaskName>
>(
  name: TaskName,
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, ThunkArg, {}>,
  options: {
    selector: (state: Draft<State>, arg: ThunkArg) => Target | undefined;
    onPending?: TaskReducer<State, ThunkArg, Returned, 'pending'>;
    onFulfill?: TaskReducer<State, ThunkArg, Returned, 'fulfilled'>;
    onReject?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
    onAbort?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
  }
): void;

export function addTaskHandler<
  TaskName extends string,
  State extends WithTask<TaskName>,
  Returned,
  ThunkArg
>(
  name: TaskName,
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, ThunkArg, {}>,
  options?: {
    onPending?: TaskReducer<State, ThunkArg, Returned, 'pending'>;
    onFulfill?: TaskReducer<State, ThunkArg, Returned, 'fulfilled'>;
    onReject?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
    onAbort?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
  }
): void;

export function addTaskHandler<
  TaskName extends string,
  State,
  Returned,
  ThunkArg,
  Target extends WithTask<TaskName>
>(
  name: TaskName,
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, ThunkArg, {}>,
  options: {
    selector?: (state: Draft<State>, arg: ThunkArg) => Target | undefined;
    onPending?: TaskReducer<State, ThunkArg, Returned, 'pending'>;
    onFulfill?: TaskReducer<State, ThunkArg, Returned, 'fulfilled'>;
    onReject?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
    onAbort?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
  } = {}
) {
  const pendingField = `${name}Pending`;
  const errorField = `${name}Error`;
  const selector = options.selector;

  builder.addCase(thunk.pending, (state, action) => {
    const target: any = selector ? selector(state, action.meta.arg) : state;
    if (!target) {
      return;
    }

    target[pendingField] = true;
    options.onPending && options.onPending(state, action);
  });

  builder.addCase(thunk.fulfilled, (state, action) => {
    const target: any = selector ? selector(state, action.meta.arg) : state;
    if (!target) {
      return;
    }

    target[pendingField] = false;
    target[errorField] = undefined;
    options.onFulfill && options.onFulfill(state, action);
  });

  builder.addCase(thunk.rejected, (state, action) => {
    const target: any = selector ? selector(state, action.meta.arg) : state;
    if (!target) {
      return;
    }

    target[pendingField] = false;
    if (action.error.name === 'AbortError') {
      options.onAbort && options.onAbort(state, action);
    } else {
      target[errorField] = action.error.message;
      options.onReject && options.onReject(state, action);
    }
  });
}
