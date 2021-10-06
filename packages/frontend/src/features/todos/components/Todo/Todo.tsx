import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { todosActions } from '../../slice';
import { Editor } from './Editor';

type Props = {
  id: string;
  isEditMode?: boolean;
};

export const Todo: FC<Props> = ({ id, isEditMode }) => {
  const todo = useAppSelector((state) => state.todos.list[id]);
  const dispatch = useAppDispatch();

  const onDoneClick = () => {
    const params = {
      id,
      done: !todo.done,
    };
    dispatch(todosActions.changeTodoLocal(params));
    dispatch(todosActions.changeTodo({ params }));
  };

  const onTextChange = (value: string) => {
    const params = {
      id,
      text: value,
    };
    dispatch(todosActions.changeTodoLocal(params));
    dispatch(todosActions.changeTodo({ params }));
  };

  const onDelete = () => {
    dispatch(todosActions.deleteTodoLocal(id));
    dispatch(
      todosActions.deleteTodo({
        params: { id },
      })
    );
  };

  return (
    <Editor
      text={todo.text}
      done={todo.done}
      onDoneClick={onDoneClick}
      onTextChange={onTextChange}
      onDelete={onDelete}
      isEditMode={isEditMode}
    />
  );
};
