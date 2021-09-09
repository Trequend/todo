import { FC } from 'react';
import { Route, Switch } from 'react-router';
import withUser from './hoc/withUser';
import { Home, Login } from './pages';

const App: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={withUser(Home)} />
      <Route exact path={['/signin', '/signup']} component={Login} />
    </Switch>
  );
};

export default App;
