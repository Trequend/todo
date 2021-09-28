import { Todo } from '../../types';
import { fetchApi } from '../../utils/fetchApi';

export async function fetchTodos() {
  const todos: Todo[] = await fetchApi('/todos');
  return todos;
}

export async function createTodo(text: string) {
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

export async function deleteTodo(id: string) {
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
