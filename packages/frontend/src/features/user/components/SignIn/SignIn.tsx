import { FC, useEffect } from 'react';
import { Input, Form, Alert } from 'antd';
import { Button } from 'src/components';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { Link } from 'react-router-dom';
import { userActions } from '../../slice';
import styles from './SignIn.module.scss';

export const SignIn: FC = () => {
  const loading = useAppSelector((state) => state.user.signInPending);
  const error = useAppSelector((state) => state.user.signInError);
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    dispatch(
      userActions.signIn({
        params: {
          email: values.email,
          password: values.password,
        },
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(userActions.removeSignInError());
    };
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <Form onFinish={onFinish}>
          <div className={styles.name}>
            <h2>Sign In</h2>
          </div>
          {error ? (
            <div className={styles.alert}>
              <Alert message={error} type="error" />
            </div>
          ) : null}
          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'Invalid email' },
              { required: true, message: 'Required field' },
            ]}
          >
            <Input
              prefix={<MailOutlined className={styles.formIcon} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.formIcon} />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className={styles.button}
              loading={loading}
              loadingDelay={500}
            >
              Sign In
            </Button>
            <div className={styles.signup}>
              <span>or</span>
              <Link to="/signup">Sign Up</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
