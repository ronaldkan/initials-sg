import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import 'antd/dist/antd.css';
import 'sgds-govtech/css/sgds.css';
import './App.css';

import Home from '../static/home';
import About from '../static/about';
import Faq from '../static/faq';
import UserHome from '../user/home';
import UserLogin from '../user/login';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/faq" exact component={Faq} />
        <Route path="/demo" exact component={UserHome} />
        <Route path="/demo/login" exact component={UserLogin} />
      </Switch>
    );
  }
}

export default App;
