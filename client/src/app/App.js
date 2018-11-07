import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import * as Cookies from 'js-cookie';
import 'antd/dist/antd.css';
import 'sgds-govtech/css/sgds.css';
import './App.css';

import Home from '../static/home';
import About from '../static/about';
import Faq from '../static/faq';
import UserLanding from '../user/landing';
import UserLogin from '../user/login';
import UserHome from '../user/home';
import UserEdit from '../user/template/edit';
import UserView from '../user/template/view';
import UserJob from '../user/job';
import UserSign from '../user/sign';
import UserComplete from '../user/common/complete';
import UserCompletedView from '../user/view';

const cookieName = 'initialsdemo';
const UserRoute = ({ component: Component, ...rest }) => {
  if (Cookies.get(cookieName)) {
    return (<Route
      {...rest}
      render={props => (
        <Component {...props} />
      )}
    />);
  }
  return (
    <Redirect to={{
      pathname: '/',
    }}
    />
  );
};

const UserLoginRoute = ({ component: Component, ...rest }) => {
  if (!Cookies.get(cookieName)) {
    return (<Route
      {...rest}
      render={props => (
        <Component {...props} />
      )}
    />);
  }
  return (
    <Redirect to={{
      pathname: '/demo',
    }}
    />
  );
};

class App extends Component {

  NoMatch = ({ location }) => (
    <Redirect to={{
      pathname: '/',
    }}
    />
  );

  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/faq" exact component={Faq} />
        <UserRoute path="/demo" exact component={UserHome} />
        <UserRoute path="/demo/job" exact component={UserJob} />
        <UserRoute path="/demo/edit/:document" exact component={UserEdit} />
        <UserRoute path="/demo/view/:document" exact component={UserView} />
        <Route path="/demo/sign/:uuid" exact component={UserSign} />
        <Route path="/demo/complete" exact component={UserComplete} />
        <UserRoute path="/demo/completed/:uuid" exact component={UserCompletedView} />
        {/* <Route path="/demo/home" exact component={UserLanding} /> */}
        <UserLoginRoute path="/demo/login" exact component={UserLogin} />
        <Route component={this.NoMatch} />
      </Switch>
    );
  }
}

export default App;
