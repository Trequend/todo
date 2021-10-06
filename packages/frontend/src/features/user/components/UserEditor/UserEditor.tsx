import { UserOutlined } from '@ant-design/icons';
import { Alert, Avatar, Row, Col, Form, Input, message } from 'antd';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getFileUrl } from 'src/utils';
import { ApiError } from 'src/errors';
import { AvatarSelector, ValueEditor } from './components';
import { userActions } from '../../slice';
import { UserAvatar } from '../UserAvatar';
import styles from './UserEditor.module.scss';

export const UserEditor: FC = () => {
  const user = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  if (!user) {
    return <Alert type="error" message="Error" description="No user" />;
  }

  const changeAvatar = async (values: any) => {
    if (!values.avatar) {
      throw new ApiError('No file selected');
    }

    const length = values.avatar.length;
    const avatar = values.avatar[length - 1];
    await new Promise((resolve, reject) => {
      dispatch(
        userActions.changeAvatar({
          onFulfill: resolve,
          onReject: reject,
          params: {
            file: avatar.originFileObj,
          },
        })
      );
    });
  };

  const changeUser = async (values: any) => {
    await new Promise((resolve, reject) => {
      dispatch(
        userActions.changeUser({
          onFulfill: resolve,
          onReject: reject,
          params: values,
        })
      );
    });
  };

  const changePassword = async (values: any) => {
    await new Promise<void>((resolve, reject) => {
      dispatch(
        userActions.changePassword({
          onFulfill: () => {
            message.success('Password changed');
            resolve();
          },
          onReject: reject,
          params: values,
        })
      );
    });
  };

  const deleteAvatar = async () => {
    await new Promise<void>((resolve, reject) => {
      dispatch(
        userActions.deleteAvatar({
          onFulfill: resolve,
          onReject: reject,
        })
      );
    });
  };

  return (
    <div className={styles.root}>
      <Row>
        <Col span={24} md={11}>
          <ValueEditor
            className={styles.item}
            name="Avatar"
            onFinish={changeAvatar}
            onDelete={user.avatarId ? deleteAvatar : undefined}
            preview={
              <Avatar
                icon={<UserOutlined />}
                alt="User avatar"
                src={user.avatarId ? <UserAvatar /> : undefined}
                shape="square"
                size={64}
              />
            }
            form={
              <AvatarSelector
                name="avatar"
                initialValue={
                  user.avatarId ? getFileUrl(user.avatarId) : undefined
                }
                size={64}
              />
            }
          />
        </Col>
        <Col span={0} md={2} />
        <Col span={24} md={11}>
          <ValueEditor
            className={styles.item}
            name="First name"
            onFinish={changeUser}
            preview={user.firstName}
            form={
              <Form.Item
                name="firstName"
                initialValue={user.firstName}
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input placeholder="First name" />
              </Form.Item>
            }
          />
          <ValueEditor
            className={styles.item}
            name="Last name"
            onFinish={changeUser}
            preview={user.lastName}
            form={
              <Form.Item
                name="lastName"
                initialValue={user.lastName}
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
            }
          />
        </Col>
      </Row>
      <ValueEditor
        className={styles.item}
        name="Email"
        onFinish={changeUser}
        preview={user.email}
        form={
          <Form.Item
            name="email"
            initialValue={user.email}
            rules={[
              { type: 'email', message: 'Invalid email' },
              { required: true, message: 'Required field' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        }
      />
      <ValueEditor
        className={styles.item}
        name="Password"
        onFinish={changePassword}
        preview={null}
        form={
          <>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Required field' },
                { min: 6, message: 'Min length 6 characters' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Required field' },
                { min: 6, message: 'Min length 6 characters' },
              ]}
            >
              <Input.Password placeholder="New password" />
            </Form.Item>
          </>
        }
      />
    </div>
  );
};
