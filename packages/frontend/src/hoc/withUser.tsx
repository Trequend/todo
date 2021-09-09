import { Redirect } from 'react-router-dom';
import useUser from '../hooks/useUser';
import User from '../types/User';

interface WithUser {
  user: User;
}

export default function withUser<T extends WithUser>(
  Component: React.ComponentType<T>
) {
  return (props: Omit<T, keyof WithUser>) => {
    const user = useUser();

    if (user) {
      return <Component {...(props as T)} user={user} />;
    } else {
      return <Redirect to="/signin" />;
    }
  };
}
