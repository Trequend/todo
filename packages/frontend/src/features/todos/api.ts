import { Todo } from 'src/types';
import { createApiFunction } from 'src/utils';

export const fetchTodos = createApiFunction(async (fetchApi) => {
  const todos: Todo[] = await fetchApi('/todos');
  return todos;
});

export type CreateTodoParams = {
  text: string;
};

export const createTodo = createApiFunction(
  async (fetchApi, { text }: CreateTodoParams) => {
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
);

export type ChangeTodoParams = {
  id: string;
  text?: string;
  done?: boolean;
};

export const changeTodo = createApiFunction(
  async (fetchApi, params: ChangeTodoParams) => {
    const { id, ...rest } = params;
    const todo: Todo = await fetchApi(`/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rest),
    });

    return todo;
  }
);

export type DeleteTodoParams = {
  id: string;
};

export const deleteTodo = createApiFunction(
  async (fetchApi, { id }: DeleteTodoParams) => {
    await fetchApi(`/todos/${id}`, {
      method: 'DELETE',
    });
  }
);
