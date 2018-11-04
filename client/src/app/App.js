import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

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

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/faq" exact component={Faq} />
        <Route path="/demo" exact component={UserHome} />
        <Route path="/demo/job" exact component={UserJob} />
        <Route path="/demo/edit" exact component={UserEdit} />
        <Route path="/demo/view" exact component={UserView} />
        <Route path="/demo/home" exact component={UserLanding} />
        <Route path="/demo/login" exact component={UserLogin} />
      </Switch>
    );
  }
}

export default App;
