import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import AuthLinks from './AuthLinks';
import GuestLinks from './GuestLinks';

const Navbar = props => {
  const { auth, profile } = props;
  const links = auth.uid ? (
    <AuthLinks auth={auth} profile={profile} />
  ) : (
    <GuestLinks />
  );

  return (
    <AppBar position="static">
      <Toolbar>DevShare</Toolbar>
    </AppBar>
  );

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper orange darken-1">
          <div className="container">
            <NavLink to="/" className="brand-logo">
              DevShare
            </NavLink>
            {links}
          </div>
        </div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

export default connect(mapStateToProps)(Navbar);
