import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFirebase, withFirestore } from 'react-redux-firebase';
import classNames from 'classnames';
import moment from 'moment';

import isEmpty from '../../../utils/is-empty';

import { getProject } from '../../../store/actions/projectsActions';

import Spinner from '../../common/spinner/Spinner';
import GridContainer from '../../common/grid-container/GridContainer';
import { withStyles, Grid, Paper, Typography } from '@material-ui/core';

const styles = theme => ({
  paper: { ...theme.customs.paper },
  primary: {
    color: theme.palette.primary.main
  },
  title: {
    marginBottom: theme.spacing.unit * 4
  }
});

export class Project extends Component {
  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
  }

  render() {
    const {
      projects: { loading, project },
      classes,
      users
    } = this.props;

    const usernameAvailable =
      !isEmpty(users) && users.some(user => user.id === project.userId);

    const content =
      loading || isEmpty(project.createdAt) || !usernameAvailable ? (
        <Spinner />
      ) : (
        <GridContainer>
          <Grid item>
            <Paper className={classes.paper}>
              <Typography variant="caption">
                {moment(project.createdAt.toDate()).calendar() +
                  ' by ' +
                  users.filter(user => user.id === project.userId)[0].username}
              </Typography>
              <Typography
                variant="h2"
                gutterBottom
                align="center"
                className={classNames(classes.title, classes.primary)}
              >
                {project.title}
              </Typography>
            </Paper>
          </Grid>
        </GridContainer>
      );

    return content;
  }
}

Project.propTypes = {
  classes: PropTypes.object.isRequired,
  getProject: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
  users: PropTypes.array
};

const mapStateToProps = state => ({
  projects: state.projects,
  users: state.firestore.ordered.users
});

const mapDispatchToProps = (dispatch, { firebase, firestore }) => ({
  getProject: (...args) =>
    dispatch(getProject(...args, { firebase, firestore }))
});

export default compose(
  withFirebase,
  withFirestore,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Project);
