import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { userActions } from '../../features/user/slice';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import styles from './Home.module.scss';
import HomeHeader from './components/HomeHeader';

const Home: FC = () => {
  const userId = useAppSelector((state) => state.user.id);
  const user = useAppSelector((state) => state.user.data);
  const userLoading = useAppSelector((state) => state.user.connectPending);
  const userError = useAppSelector((state) => state.user.connectError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(userActions.connect());
    }

    return () => {
      dispatch(userActions.disconnect());
    };
  }, [dispatch, userId]);

  if (!userId) {
    return <Redirect to="/signin" />;
  }

  const reload = () => {
    window.location.reload();
  };

  if (!user || userLoading || userError) {
    return (
      <div className={styles.userInfo}>
        {userLoading ? (
          <Spin
            indicator={<LoadingOutlined className={styles.userLoadingIcon} />}
            delay={500}
          />
        ) : (
          <>
            <h2>{userError ? `${userError}` : 'Unknown error occured'}</h2>
            <Button type="primary" htmlType="button" onClick={reload}>
              Reload
            </Button>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <HomeHeader user={user} />
      </div>
    );
  }
};

export default Home;
