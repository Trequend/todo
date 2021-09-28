import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import { STORE_KEYS } from '../../../app/persistentStore';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { usePersistentStore } from '../../../hooks/usePersistentStore';
import { userActions } from '../slice';

type Props = Omit<ButtonProps, 'loading'>;

const LogoutButton: FC<Props> = ({
  onClick: clickCallback,
  children,
  ...props
}) => {
  const authorized = usePersistentStore(STORE_KEYS.AUTHORIZED);
  const pending = useAppSelector((state) => state.user.logoutPending);
  const dispatch = useAppDispatch();

  const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!authorized) {
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
      disabled={!authorized}
    >
      {children ?? 'Logout'}
    </Button>
  );
};

export default LogoutButton;
