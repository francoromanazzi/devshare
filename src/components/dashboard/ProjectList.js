import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { List } from '@material-ui/core';
import ProjectItem from './ProjectItem';

const ProjectList = ({ projects }) => {
  console.log(projects);
  return (
    <List>
      {projects &&
        projects.map(project => (
          <ProjectItem key={project.uid} project={project} />
        ))}
    </List>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.object
};

const mapStateToProps = state => ({
  projects: state.firestore.ordered.projects
});

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: 'projects', orderBy: ['createdAt', 'desc'] }])
)(ProjectList);
