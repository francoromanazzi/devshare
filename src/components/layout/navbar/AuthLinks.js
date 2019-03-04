import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';

const AuthLinks = ({ profile, auth }) => {
  const onSignOutClick = () => {
    firebase.auth().signOut();
  };

  return (
    <React.Fragment>
      <a onClick={onSignOutClick}>Log Out</a>
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
    </React.Fragment>
  );
};

AuthLinks.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default AuthLinks;
