import { FC, useEffect, useState } from 'react';
import { Button, Input, Form, Row, Col, Alert, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../app/store';
import { userActions } from '../../slice';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import styles from './SignUp.module.scss';
import { Link, useHistory } from 'react-router-dom';

export const SignUp: FC = () => {
  const history = useHistory();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const loading = useSelector((state: AppState) => state.user.signUpPending);
  const error = useSelector((state: AppState) => state.user.signUpError);
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    dispatch(
      userActions.signUp({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
      })
    );
    setFormSubmitted(true);
  };

  useEffect(() => {
    return () => {
      dispatch(userActions.removeSignUpError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (formSubmitted && !loading && !error) {
      message.success('User registered');
      history.push('/signin');
    } else if (!loading) {
      setFormSubmitted(false);
    }
  }, [history, formSubmitted, loading, error]);

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <Form onFinish={onFinish}>
          <div className={styles.name}>
            <h2>Sign Up</h2>
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
          <Row gutter={24}>
            <Col span={24} sm={12}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Required field' },
              { min: 6, message: 'Min length 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.formIcon} />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            rules={[
              { required: true, message: 'Required field' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject('Passwords do not match');
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.formIcon} />}
              placeholder="Confirm password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className={styles.button}
              loading={loading}
            >
              Sign Up
            </Button>
            <div className={styles.signin}>
              <span>or</span>
              <Link to="/signin">Sign In</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
