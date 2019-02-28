import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setNewProjectRepoUrl } from '../../../store/actions/projectsActions';

import { ListItem, ListItemText } from '@material-ui/core';

const GithubRepoItem = props => {
  console.log(props.repo);

  const onRepoClick = () => {
    props.setNewProjectRepoUrl(props.repo.html_url);
  };

  return (
    <ListItem button onClick={onRepoClick}>
      <ListItemText primary={props.repo.name} />
    </ListItem>
  );
};

GithubRepoItem.propTypes = {
  repo: PropTypes.object.isRequired,
  setNewProjectRepoUrl: PropTypes.func.isRequired
};

export default connect(
  null,
  { setNewProjectRepoUrl }
)(GithubRepoItem);
