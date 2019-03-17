import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth, NotAuth } from './helpers/auth';

import Spinner from './components/common/spinner/Spinner';
import Navbar from './components/layout/navbar/Navbar';
import Login from './components/auth/Login';
import Landing from './components/landing/Landing';
import Dashboard from './components/dashboard/Dashboard';
import AddProject from './components/projects/add-project/AddProject';
import EditProject from './components/projects/edit-project/EditProject';
import NotFound from './components/not-found/NotFound';

import './App.css';

class App extends Component {
  render() {
    const { auth, profile } = this.props;
    return !auth.isLoaded || !profile.isLoaded ? (
      <Spinner />
    ) : (
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
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

export default connect(mapStateToProps)(App);
