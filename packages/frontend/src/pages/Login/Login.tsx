import { CheckOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { AppState } from '../../app/store';
import { SignIn, SignUp } from '../../features/user/components';
import createAnimationClassNames from '../../utils/createAnimationClassNames';
import styles from './Login.module.scss';

const Login: FC = () => {
  const location = useLocation();
  const user = useSelector((state: AppState) => state.user.data);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className={styles.root}>
        <header className={styles.header}>
          <h1>
            Todo{' '}
            <span className={styles.logoIcon}>
              <CheckOutlined />
            </span>{' '}
            App
          </h1>
        </header>
        <main className={styles.content}>
          <SwitchTransition>
            <CSSTransition
              key={location.key}
              timeout={500}
              classNames={createAnimationClassNames('fade', styles)}
            >
              <Switch location={location}>
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signup" component={SignUp} />
              </Switch>
            </CSSTransition>
          </SwitchTransition>
        </main>
        <footer className={styles.footer}>Todo App by Dmitry Balakin</footer>
      </div>
    </>
  );
};

export default Login;
