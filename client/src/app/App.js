import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import 'sgds-govtech/css/sgds.css';
import './App.css';

import Auth from './Auth';
import AuthAdmin from './AuthAdmin';
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
import AdminHome from '../admin/home';
import AdminAccount from '../admin/account';
import AdminOrg from '../admin/org';
import AdminAddressBookEntry from '../admin/addressbookentry';


class App extends Component {

  NoMatch = ({ location }) => (
    <Redirect to={{
      pathname: '/',
    }}
    />
  );

  RedirectPlatform = ({ location }) => (
    <Redirect to={{
      pathname: '/platform/login',
    }}
    />
  );

  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/faq" exact component={Faq} />
        <Route path="/platform" exact component={Auth(UserHome)} />
        <Route path="/platform/job" exact component={Auth(UserJob)} />
        <Route path="/platform/edit/:document" exact component={Auth(UserEdit)} />
        <Route path="/platform/view/:document" exact component={Auth(UserView)} />
        <Route path="/platform/account" exact component={Auth(UserAccount)} />
        <Route path="/platform/sign/:uuid" exact component={UserSign} />
        <Route path="/platform/complete" exact component={UserComplete} />
        <Route path="/platform/completed/:uuid" exact component={Auth(UserCompletedView)} />
        <Route path="/platform/login" exact component={UserLogin} />
        <Route path="/admin" exact component={AuthAdmin(AdminHome)} />
        <Route path="/admin/login" exact component={AdminLogin} />
        <Route path="/admin/home" exact component={AuthAdmin(AdminHome)} />
        <Route path="/admin/account" exact component={AuthAdmin(AdminAccount)} />
        <Route path="/admin/org" exact component={AuthAdmin(AdminOrg)} />
        <Route path="/admin/addressbookentry" exact component={AuthAdmin(AdminAddressBookEntry)} />
        <Route component={this.NoMatch} />
      </Switch>
    );
  }
}

export default App;
