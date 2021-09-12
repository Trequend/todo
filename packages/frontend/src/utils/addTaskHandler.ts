import {
  ActionReducerMapBuilder,
  AsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

type WithTaskPending<Name extends string> = {
  [field in `${Name}Pending`]?: boolean;
};

type WithTaskError<Name extends string> = {
  [field in `${Name}Error`]?: string;
};

export type WithTask<Name extends string> = WithTaskPending<Name> &
  WithTaskError<Name>;

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

export default function addTaskHandler<
  TaskName extends string,
  State extends WithTask<TaskName>,
  Returned,
  ThunkArg
>(
  name: TaskName,
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, ThunkArg, {}>,
  options: {
    onPending?: TaskReducer<State, ThunkArg, Returned, 'pending'>;
    onFulfill?: TaskReducer<State, ThunkArg, Returned, 'fulfilled'>;
    onReject?: TaskReducer<State, ThunkArg, unknown, 'rejected'>;
  } = {}
) {
  const pendingField = `${name}Pending`;
  const errorField = `${name}Error`;

  builder.addCase(thunk.pending, (state, action) => {
    (state as any)[pendingField] = true;
    options.onPending && options.onPending(state, action);
  });

  builder.addCase(thunk.fulfilled, (state, action) => {
    (state as any)[pendingField] = false;
    (state as any)[errorField] = undefined;
    options.onFulfill && options.onFulfill(state, action);
  });

  builder.addCase(thunk.rejected, (state, action) => {
    (state as any)[pendingField] = false;
    (state as any)[errorField] = action.error.message;
    options.onReject && options.onReject(state, action);
  });
}
