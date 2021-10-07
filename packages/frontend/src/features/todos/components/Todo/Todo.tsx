import { message } from 'antd';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { Todo as TodoType } from 'src/types';
import { todosActions } from '../../slice';
import { TodoView } from './TodoView';

type Props = {
  id: string;
  isEditMode?: boolean;
};

export const Todo: FC<Props> = ({ id, isEditMode }) => {
  const todo = useAppSelector((state) => state.todos.list[id]);
  const isHidden = useAppSelector((state) => state.todos.hiddenTodos[id]);
  const dispatch = useAppDispatch();

  const changeTodo = (params: Partial<TodoType>) => {
    const actionParams = {
      ...params,
      id,
    };
    dispatch(todosActions.changeTodoLocal(actionParams));
    dispatch(
      todosActions.changeTodo({
        params: actionParams,
        canAbort: (actionParams) => actionParams.id === id,
        onReject: () => {
          message.error('Failed change todo');
          dispatch(
            todosActions.changeTodoLocal({
              id,
              ...todo,
            })
          );
        },
      })
    );
  };

  const onDoneClick = () => {
    changeTodo({
      done: !todo.done,
    });
  };

  const onTextChange = (value: string) => {
    changeTodo({
      text: value,
    });
  };

  const onDelete = () => {
    if (todo.deletePending) {
      return;
    }

    dispatch(todosActions.hideTodoLocal(id));
    dispatch(
      todosActions.deleteTodo({
        params: { id },
        onReject: () => {
          message.error('Failed delete todo');
          dispatch(todosActions.showTodoLocal(id));
        },
      })
    );
  };

  return isHidden ? null : (
    <TodoView
      text={todo.text}
      done={todo.done}
      onDoneClick={onDoneClick}
      onTextChange={onTextChange}
      onDelete={onDelete}
      isEditMode={isEditMode}
    />
  );
};
