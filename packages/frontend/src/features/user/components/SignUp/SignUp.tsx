import { FC, useEffect } from 'react';
import { Input, Form, Row, Col, Alert, message } from 'antd';
import { Button } from 'src/components';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'antd/lib/form/Form';
import { userActions } from '../../slice';
import styles from './SignUp.module.scss';

export const SignUp: FC = () => {
  const history = useHistory();
  const [form] = useForm();
  const loading = useAppSelector((state) => state.user.signUpPending);
  const error = useAppSelector((state) => state.user.signUpError);
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    dispatch(
      userActions.signUp({
        onFulfill: () => {
          form.resetFields();
          message.success('User registered');
          history.push('/signin');
        },
        params: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        },
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(userActions.removeSignUpError());
    };
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <Form form={form} onFinish={onFinish}>
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
              loadingDelay={500}
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
