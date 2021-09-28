import { FC, useEffect, useState } from 'react';
import { Button as AntdButton, ButtonProps } from 'antd';

type Props = {
  loadingDelay?: number;
} & ButtonProps;

export const Button: FC<Props> = ({ loadingDelay, loading, ...props }) => {
  const [loadingStarted, setLoadingStarted] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (loading) {
      if (loadingDelay) {
        timeout = setTimeout(() => {
          setLoadingStarted(true);
        }, loadingDelay);
      } else {
        setLoadingStarted(true);
      }
    } else {
      setLoadingStarted(false);
    }

    return () => {
      if (timeout) {
        return clearTimeout(timeout);
      }
    };
  }, [loading, loadingDelay]);

  return <AntdButton loading={loadingStarted} {...props} />;
};
