import { PlusOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Drawer, PageHeader, Popover, Modal, Button } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { FC, useState } from 'react';
import { FormattedDate } from '../../../components/FormattedDate';
import { CreateTodoForm } from '../../../features/todos/components';
import { LogoutButton, UserEditor } from '../../../features/user/components';
import { UserAvatar } from '../../../features/user/components/UserAvatar';
import { useAppSelector } from '../../../hooks/useAppSelector';
import styles from './HomeHeader.module.scss';

type Props = {
  className?: string;
};

export const HomeHeader: FC<Props> = ({ className }) => {
  const breakpoints = useBreakpoint();
  const user = useAppSelector((state) => state.user.data);
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [userEditorVisible, setUserEditorVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  if (!user) {
    return <Alert message="Error" description="No user" type="error" />;
  }

  return (
    <header className={className}>
      <Drawer
        visible={addTodoVisible}
        title="Create todo"
        onClose={() => setAddTodoVisible(false)}
        width={breakpoints.sm ? '400px' : undefined}
      >
        <CreateTodoForm />
      </Drawer>
      <Modal
        title="Settings"
        visible={userEditorVisible}
        onCancel={() => setUserEditorVisible(false)}
        footer={null}
      >
        <UserEditor />
      </Modal>
      <PageHeader
        avatar={{
          icon: <UserOutlined />,
          alt: 'User avatar',
          src: user.avatarId ? <UserAvatar /> : undefined,
        }}
        title={
          breakpoints.sm ? `${user.firstName} ${user.lastName}` : user.firstName
        }
        subTitle={
          breakpoints.sm ? <FormattedDate format={'dddd HH:mm'} /> : null
        }
        extra={[
          <div className={styles.extra} key={0}>
            <PlusOutlined
              className={`${styles.extraIcon} ${styles.notificationsButton}`}
              tabIndex={-1}
              role="button"
              onClick={() => setAddTodoVisible(true)}
            />
            <Popover
              content={
                <div className={styles.settingsButtons}>
                  <Button
                    type="text"
                    htmlType="button"
                    onClick={() => {
                      setUserEditorVisible(true);
                      setPopoverVisible(false);
                    }}
                  >
                    Settings
                  </Button>
                  <LogoutButton type="text" htmlType="button" />
                </div>
              }
              visible={popoverVisible}
              onVisibleChange={(value) => setPopoverVisible(value)}
              placement="bottomRight"
              trigger="click"
              arrowPointAtCenter
            >
              <SettingOutlined
                className={styles.extraIcon}
                onClick={() => {
                  setPopoverVisible(true);
                }}
              />
            </Popover>
          </div>,
        ]}
      />
    </header>
  );
};
