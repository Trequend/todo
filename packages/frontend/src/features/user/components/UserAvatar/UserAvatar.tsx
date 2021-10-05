import { EyeOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { FC } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { getFileUrl } from '../../../../utils/getFileUrl';
import styles from './UserAvatar.module.scss';

export const UserAvatar: FC = () => {
  const avatarId = useAppSelector((state) => state.user.data?.avatarId);

  return avatarId ? (
    <div className={styles.root}>
      <Image
        src={getFileUrl(avatarId)}
        preview={{
          mask: <EyeOutlined />,
        }}
      />
    </div>
  ) : null;
};
