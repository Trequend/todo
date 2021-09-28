import { PlusOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Drawer, PageHeader, Popover } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { FC, useState } from 'react';
import { FormattedDate } from '../../../components/FormattedDate';
import { CreateTodoForm } from '../../../features/todos/components';
import { LogoutButton } from '../../../features/user/components';
import { useAppSelector } from '../../../hooks/useAppSelector';
import styles from './HomeHeader.module.scss';

type Props = {
  className?: string;
};

export const HomeHeader: FC<Props> = ({ className }) => {
  const breakpoints = useBreakpoint();
  const user = useAppSelector((state) => state.user.data);
  const [addTodoVisible, setAddTodoVisible] = useState(false);

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
      <PageHeader
        avatar={{
          icon: <UserOutlined />,
          alt: 'User avatar',
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
                  <LogoutButton type="text" htmlType="button" />
                </div>
              }
              trigger="click"
              placement="bottomRight"
              arrowPointAtCenter
            >
              <SettingOutlined className={styles.extraIcon} />
            </Popover>
          </div>,
        ]}
      />
    </header>
  );
};
