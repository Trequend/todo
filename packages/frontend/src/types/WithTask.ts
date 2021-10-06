type WithTaskPending<Name extends string> = {
  [field in `${Name}Pending`]?: boolean;
};

type WithTaskError<Name extends string> = {
  [field in `${Name}Error`]?: string;
};

export type WithTask<Name extends string> = WithTaskPending<Name> &
  WithTaskError<Name>;
