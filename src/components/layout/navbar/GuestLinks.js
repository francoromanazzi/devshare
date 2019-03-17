import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { signUp } from '../../../store/actions/authActions';

import { withStyles, Button, Icon } from '@material-ui/core';

const styles = theme => ({
  githubButton: {
    backgroundColor: theme.palette.common.black
  },
  githubIcon: {
    marginLeft: '0.5rem'
  }
});

const GuestLinks = props => {
  return (
    <React.Fragment>
      <Button
        onClick={props.signUp}
        color="inherit"
        className={props.classes.githubButton}
      >
        Sign up
        <Icon
          className={classNames('fab fa-github', props.classes.githubIcon)}
        />
      </Button>
    </React.Fragment>
  );
};

GuestLinks.propTypes = {
  classes: PropTypes.object.isRequired,
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
)(GuestLinks);
