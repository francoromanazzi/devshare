import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth, NotAuth } from './helpers/auth';

import Navbar from './components/layout/navbar/Navbar';
import Login from './components/auth/Login';
import Landing from './components/landing/Landing';
import Dashboard from './components/dashboard/Dashboard';
import AddProject from './components/projects/add-project/AddProject';
import EditProject from './components/projects/EditProject';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={NotAuth(Landing)} />
            <Route exact path="/login" component={NotAuth(Login)} />
            <Route exact path="/dashboard" component={Auth(Dashboard)} />
            <Route exact path="/projects/add" component={Auth(AddProject)} />
            <Route
              exact
              path="/projects/:projectId"
              component={Auth(EditProject)}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
