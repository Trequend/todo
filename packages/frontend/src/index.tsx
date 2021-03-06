import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import 'antd/dist/antd.less';
import './styles/global.scss';
import { Home, Login } from './pages';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path={['/signin', '/signup']} component={Login} />
      </Switch>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
