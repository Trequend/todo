type Todo = {
  _id: { $oid: string };
  done: boolean;
  text: string;
};

export default Todo;
