import { FC, useEffect, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { STORE_KEYS } from '../../app/persistentStore';
import { Indicator } from '../../components/Indicator/Indicator';
import { TodosList } from '../../features/todos/components';
import { userActions } from '../../features/user/slice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePersistentStore } from '../../hooks/usePersistentStore';
import { HomeHeader } from './components/HomeHeader';
import styles from './Home.module.scss';

export const Home: FC = () => {
  const authorized = usePersistentStore(STORE_KEYS.AUTHORIZED);
  const loading = useAppSelector((state) => state.user.fetchPending);
  const error = useAppSelector((state) => state.user.fetchError);
  const dispatch = useAppDispatch();

  const connect = useMemo(() => {
    return () => {
      if (authorized) {
        dispatch(userActions.fetchUser());
        dispatch(userActions.connect());
      }
    };
  }, [authorized, dispatch]);

  const disconnect = useMemo(() => {
    return () => {
      dispatch(userActions.disconnect());
    };
  }, [dispatch]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  if (!authorized) {
    return <Redirect to="/signin" />;
  }

  if (loading || error) {
    return <Indicator loading={loading} error={error} onReload={connect} />;
  } else {
    return (
      <div className={styles.root}>
        <HomeHeader className={styles.header} />
        <div className={styles.todos}>
          <TodosList />
        </div>
      </div>
    );
  }
};
