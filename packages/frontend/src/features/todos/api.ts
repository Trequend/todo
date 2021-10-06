import { Todo } from 'src/types';
import { fetchApi } from 'src/utils';

export async function fetchTodos() {
  const todos: Todo[] = await fetchApi('/todos');
  return todos;
}

export type CreateTodoParams = {
  text: string;
};

export async function createTodo({ text }: CreateTodoParams) {
  const todo: Todo = await fetchApi('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  });

  return todo;
}

export type ChangeTodoParams = {
  id: string;
  text?: string;
  done?: boolean;
};

export async function changeTodo(params: ChangeTodoParams) {
  const todo: Todo = await fetchApi('/todos', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  return todo;
}

export type DeleteTodoParams = {
  id: string;
};

export async function deleteTodo({ id }: DeleteTodoParams) {
  await fetchApi('/todos', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  });
}
