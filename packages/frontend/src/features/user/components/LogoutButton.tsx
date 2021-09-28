import { ButtonProps } from 'antd';
import { Button } from '../../../components/Button/Button';
import { FC } from 'react';
import { STORE_KEYS } from '../../../app/persistentStore';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { usePersistentStore } from '../../../hooks/usePersistentStore';
import { userActions } from '../slice';

type Props = Omit<ButtonProps, 'loading'>;

export const LogoutButton: FC<Props> = ({
  onClick: clickCallback,
  disabled,
  children,
  ...props
}) => {
  const authorized = usePersistentStore(STORE_KEYS.AUTHORIZED);
  const pending = useAppSelector((state) => state.user.logoutPending);
  const dispatch = useAppDispatch();

  const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (pending || !authorized) {
      return;
    }

    dispatch(userActions.logout());
    clickCallback && clickCallback(event);
  };

  return (
    <Button
      {...props}
      onClick={onClick}
      loading={pending}
      disabled={disabled || !authorized}
      loadingDelay={500}
    >
      {children ?? 'Logout'}
    </Button>
  );
};
