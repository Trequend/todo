import { FC, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { STORE_KEYS } from 'src/app/persistentStore';
import { Indicator } from 'src/components';
import { TodosList } from 'src/features/todos/components';
import { userActions } from 'src/features/user/slice';
import { useAppDispatch, useAppSelector, usePersistentStore } from 'src/hooks';
import { HomeHeader } from './HomeHeader';
import { fetchApi } from 'src/utils';
import styles from './Home.module.scss';

export const Home: FC = () => {
  const authorized = usePersistentStore(STORE_KEYS.AUTHORIZED);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const connect = useCallback(() => {
    if (authorized) {
      dispatch(userActions.fetchUser());
      dispatch(userActions.connect());
    }
  }, [authorized, dispatch]);

  const disconnect = useCallback(() => {
    dispatch(userActions.disconnect());
  }, [dispatch]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  useEffect(() => {
    if (!authorized) {
      return;
    }

    const TEN_MINUTES = 10 * 60 * 1000;
    const interval = setInterval(() => {
      fetchApi('/user/live');
    }, TEN_MINUTES);

    return () => {
      clearInterval(interval);
    };
  }, [authorized]);

  if (!authorized) {
    return <Redirect to="/signin" />;
  }

  if (!user.data || user.fetchPending || user.fetchError) {
    return (
      <Indicator
        loading={user.fetchPending}
        error={user.fetchError}
        onReload={connect}
      />
    );
  } else if (user.connectError) {
    return (
      <Indicator
        loading={user.connectPending}
        error={user.connectError}
        onReload={connect}
      />
    );
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
