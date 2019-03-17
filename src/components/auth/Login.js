import React from 'react';
import { connect } from 'react-redux';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { signUp } from '../../store/actions/authActions';

import { withStyles, Button, Icon } from '@material-ui/core';

const styles = theme => ({
  githubButton: {
    backgroundColor: theme.palette.common.black
  }
});

const Login = props => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sign up</h1>
      <h4>Registered users can share their projects</h4>
      <Button
        onClick={props.signUp}
        color="inherit"
        className={props.classes.githubButton}
      >
        Sign up with GitHub
        <Icon className="fab fa-github" />
      </Button>
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  signUp: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, { firebase, firestore }) => ({
  signUp: () => dispatch(signUp({ firebase, firestore }))
});

export default compose(
  withFirebase,
  withFirestore,
  withStyles(styles),
  connect(
    null,
    mapDispatchToProps
  )
)(Login);
