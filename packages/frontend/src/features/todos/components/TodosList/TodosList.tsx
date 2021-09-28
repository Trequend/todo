import { Button, Empty } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { Indicator } from '../../../../components/Indicator/Indicator';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { todosActions } from '../../slice';
import styles from './TodosList.module.scss';
import { Todo } from '../Todo';

export const TodosList: FC = () => {
  const todos = useAppSelector((state) => state.todos.list);
  const loading = useAppSelector((state) => state.todos.fetchPending);
  const error = useAppSelector((state) => state.todos.fetchError);
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);

  const connect = useMemo(() => {
    return () => {
      dispatch(todosActions.fetchTodos());
      dispatch(todosActions.connect());
    };
  }, [dispatch]);

  const disconnect = useMemo(() => {
    return () => {
      dispatch(todosActions.disconnect());
    };
  }, [dispatch]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  const changeEditMode = () => {
    setIsEditMode((value) => !value);
  };

  const entries = Object.entries(todos);
  return (
    <>
      {loading || error ? (
        <div className={styles.root}>
          <Indicator
            className={styles.indicator}
            loading={loading}
            error={error}
            onReload={connect}
          />
        </div>
      ) : entries.length > 0 ? (
        <div className={styles.listRoot}>
          <div className={styles.listHeader}>
            <h2>Todos</h2>
            <Button onClick={changeEditMode}>
              {isEditMode ? 'Stop editing' : 'Edit'}
            </Button>
          </div>
          {Object.keys(todos).map((id) => {
            return <Todo key={id} id={id} isEditMode={isEditMode} />;
          })}
        </div>
      ) : (
        <div className={styles.root}>
          <Empty description="No Todos" />
        </div>
      )}
    </>
  );
};
