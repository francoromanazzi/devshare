import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, withFirestore } from 'react-redux-firebase';

import isEmpty from '../../utils/is-empty';

import { getProjects } from '../../store/actions/projectsActions';

import Spinner from '../common/spinner/Spinner';
import { withStyles } from '@material-ui/core';
import ProjectItem from './ProjectItem';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2
  }
});

export class ProjectList extends Component {
  componentDidMount() {
    this.props.getProjects();
  }

  componentWillUnmount() {
    this.props.firestore.unsetListener({ collection: 'projects' });
  }

  render() {
    const { classes, projects, users } = this.props;
    return (
      <div className={classes.root}>
        {isEmpty(projects) || isEmpty(users) ? (
          <Spinner />
        ) : (
          projects.map(project => {
            const username = users.filter(user => user.id === project.userId)[0]
              .username;
            return (
              <ProjectItem
                key={project.id}
                project={project}
                username={username}
              />
            );
          })
        )}
      </div>
    );
  }
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  projects: PropTypes.array,
  users: PropTypes.array
};

const mapStateToProps = state => ({
  projects: state.firestore.ordered.projects,
  users: state.firestore.ordered.users
});

const mapDispatchToProps = (dispatch, { firebase, firestore }) => ({
  getProjects: (...args) =>
    dispatch(getProjects(...args, { firebase, firestore }))
});

export default compose(
  withFirebase,
  withFirestore,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectList);
