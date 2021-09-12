import { FC } from 'react';
import { Route, Switch } from 'react-router';
import { Home, Login } from './pages';

const App: FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path={['/signin', '/signup']} component={Login} />
    </Switch>
  );
};

export default App;
