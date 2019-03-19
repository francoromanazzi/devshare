import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, withFirestore } from 'react-redux-firebase';

import { getProjects } from '../../store/actions/projectsActions';

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
    const { classes, projects } = this.props;
    return (
      <div className={classes.root}>
        {projects &&
          projects.map(project => (
            <ProjectItem key={project.id} project={project} />
          ))}
      </div>
    );
  }
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  projects: PropTypes.array
};

const mapStateToProps = state => ({
  projects: state.firestore.ordered.projects
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
