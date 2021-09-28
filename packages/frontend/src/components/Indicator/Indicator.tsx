import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { FC } from 'react';
import styles from './Indicator.module.scss';

type Props = {
  className?: string;
  delay?: number;
  loading?: boolean;
  error?: string;
  onReload?: () => void;
};

export const Indicator: FC<Props> = ({
  className,
  delay,
  loading,
  error,
  onReload,
}) => {
  const divClassName = className ? `${styles.root} ${className}` : styles.root;
  return (
    <div className={divClassName}>
      {loading ? (
        <Spin
          indicator={<LoadingOutlined className={styles.loadingIcon} />}
          delay={delay}
        />
      ) : (
        <>
          <h2>{error ? `${error}` : 'Unknown error occured'}</h2>
          <Button type="primary" htmlType="button" onClick={onReload}>
            Reload
          </Button>
        </>
      )}
    </div>
  );
};

Indicator.defaultProps = {
  delay: 500,
} as Partial<Props>;
