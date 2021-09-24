type InsertEvent<T> = {
  type: 'insert';
  document: T;
};

type UpdateEvent<T> = {
  type: 'update';
  document: T;
};

type DeleteEvent = {
  type: 'delete';
};

export type DatabaseEvent<T> = (
  | InsertEvent<T>
  | UpdateEvent<T>
  | DeleteEvent
) & { id: string };
