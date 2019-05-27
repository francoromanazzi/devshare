import React from 'react';
import { connect } from 'react-redux';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { signUp } from '../../store/actions/authActions';

import TypedAnimation from './TypedAnimation';
import { withStyles, Typography, Button, Icon, Grid } from '@material-ui/core';
import GridContainer from '../common/grid-container/GridContainer';

import './Landing.css';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 8
  },
  title: {
    marginBottom: theme.spacing.unit * 4
  },
  white: {
    color: theme.palette.common.white
  },
  primary: {
    color: theme.palette.primary.main
  },
  signUpButton: {
    backgroundColor: theme.palette.common.white,
    justifyContent: 'center'
  },
  githubIcon: {
    marginLeft: '0.5rem'
  }
});

const Landing = ({ classes, signUp }) => {
  return (
    <div className="landing-img">
      <div className="dark-overlay-img landing-inner">
        <div className="dark-overlay-card">
          <div className={classes.root}>
            <GridContainer alignItems="center">
              <Grid item>
                <Typography
                  className={classNames(classes.title, classes.white)}
                  variant="h2"
                  color="inherit"
                  noWrap
                  gutterBottom
                >
                  {'<'}
                  <span className={classes.primary}>{'DevShare'}</span>
                  {' />'}
                </Typography>
              </Grid>
              <Grid item>
                <TypedAnimation />
              </Grid>
              <Grid item>
                <Button
                  onClick={signUp}
                  color="inherit"
                  className={classes.signUpButton}
                >
                  Join for free
                  <Icon
                    className={classNames('fab fa-github', classes.githubIcon)}
                  />
                </Button>
              </Grid>
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {
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
)(Landing);
