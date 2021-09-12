import { FC, useEffect } from 'react';
import { Button, Input, Form, Checkbox, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../app/store';
import { userActions } from '../../slice';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import styles from './SignIn.module.scss';
import { Link } from 'react-router-dom';

const SignIn: FC = () => {
  const loading = useSelector((state: AppState) => state.user.signInPending);
  const error = useSelector((state: AppState) => state.user.signInError);
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    dispatch(
      userActions.signIn({
        email: values.email,
        password: values.password,
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
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className={styles.button}
              loading={loading}
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

export default SignIn;
