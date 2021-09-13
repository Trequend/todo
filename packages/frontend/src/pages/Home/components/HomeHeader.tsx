import { BellOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Drawer,
  Empty,
  notification,
  PageHeader,
  Popover,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { FC, useEffect, useState } from 'react';
import FormattedDate from '../../../components/FormattedDate';
import { LogoutButton } from '../../../features/user/components';
import User from '../../../types/User';
import styles from './HomeHeader.module.scss';

type Props = {
  user: User;
};

const HomeHeader: FC<Props> = ({ user }) => {
  const breakpoints = useBreakpoint();
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  useEffect(() => {
    if (notificationsVisible) {
      notification.destroy();
    }
  }, [notificationsVisible]);

  return (
    <>
      <Drawer
        visible={notificationsVisible}
        title="Notifications"
        onClose={() => setNotificationsVisible(false)}
        width={breakpoints.sm ? '400px' : undefined}
      >
        <Empty description="No Notifications" />
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
          <div className={styles.extra}>
            <Badge dot offset={['-2px', '0']}>
              <BellOutlined
                className={`${styles.extraIcon} ${styles.notificationsButton}`}
                tabIndex={-1}
                role="button"
                onClick={() => setNotificationsVisible(true)}
              />
            </Badge>
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
    </>
  );
};

export default HomeHeader;
