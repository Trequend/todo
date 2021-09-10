import Todo from "./Todo.ts";

type User = {
  _id: { $oid: string };
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  todos: Array<Todo>;
};

export default User;