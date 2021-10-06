import { CheckOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { STORE_KEYS } from 'src/app/persistentStore';
import { SignIn, SignUp } from 'src/features/user/components';
import { usePersistentStore } from 'src/hooks';
import { createAnimationClassNames } from 'src/utils';
import styles from './Login.module.scss';

export const Login: FC = () => {
  const location = useLocation();
  const authorized = usePersistentStore(STORE_KEYS.AUTHORIZED);

  if (authorized) {
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
