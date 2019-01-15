import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import 'sgds-govtech/css/sgds.css';
import './App.css';

import Auth from './Auth';
import Home from '../static/home';
import About from '../static/about';
import Faq from '../static/faq';
import UserLogin from '../user/login';
import UserHome from '../user/home';
import UserEdit from '../user/template/edit';
import UserView from '../user/template/view';
import UserJob from '../user/job';
import UserSign from '../user/sign';
import UserComplete from '../user/common/complete';
import UserCompletedView from '../user/view';
import UserAccount from '../user/account';

import AdminLogin from '../admin/login';

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
        <Route path="/demo" exact component={Auth(UserHome)} />
        <Route path="/demo/job" exact component={Auth(UserJob)} />
        <Route path="/demo/edit/:document" exact component={UserEdit} />
        <Route path="/demo/view/:document" exact component={UserView} />
        <Route path="/demo/account" exact component={UserAccount} />
        <Route path="/demo/sign/:uuid" exact component={UserSign} />
        <Route path="/demo/complete" exact component={UserComplete} />
        <Route path="/demo/completed/:uuid" exact component={UserCompletedView} />
        {/* <Route path="/demo/home" exact component={UserLanding} /> */}
        <Route path="/demo/login" exact component={UserLogin} />
        <Route path="/admin" exact component={AdminLogin} />
        <Route component={this.NoMatch} />
      </Switch>
    );
  }
}

export default App;
