import { FC } from 'react';
import User from '../../types/User';

type Props = {
  user: User;
};

const Home: FC<Props> = ({ user }) => {
  return <h1>{user.firstName}</h1>;
};

export default Home;
