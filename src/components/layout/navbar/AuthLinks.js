import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';

const AuthLinks = ({ profile, auth }) => {
  const onSignOutClick = () => {
    firebase.auth().signOut();
  };

  return (
    <ul id="nav-mobile" className="right hide-on-med-and-down fa-ul">
      <li>
        <a href="#">Components</a>
      </li>
      <li>
        <a onClick={onSignOutClick}>Log Out</a>
      </li>
      <li>
        <img
          src={auth.photoURL}
          alt={`${auth.displayName}'s avatar`}
          style={{
            height: '50px',
            verticalAlign: 'middle',
            borderRadius: '50%',
            padding: '0em 2em'
          }}
        />
      </li>
    </ul>
  );
};

AuthLinks.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default AuthLinks;
