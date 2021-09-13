import { Button, ButtonProps } from 'antd';
import { FC } from 'react';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { userActions } from '../slice';

type Props = Omit<ButtonProps, 'loading'>;

const LogoutButton: FC<Props> = ({
  onClick: clickCallback,
  children,
  ...props
}) => {
  const userId = useAppSelector((state) => state.user.id);
  const pending = useAppSelector((state) => state.user.logoutPending);
  const dispatch = useAppDispatch();

  const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!userId) {
      return;
    }

    dispatch(userActions.logout());
    clickCallback && clickCallback(event);
  };

  return (
    <Button {...props} onClick={onClick} loading={pending} disabled={!userId}>
      {children ?? 'Logout'}
    </Button>
  );
};

export default LogoutButton;
