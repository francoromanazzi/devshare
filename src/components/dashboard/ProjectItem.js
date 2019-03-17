import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/is-empty';

import { ListItem } from '@material-ui/core';
import Spinner from '../common/spinner/Spinner';

const ProjectItem = ({ project }) => {
  return isEmpty(project) ? <Spinner /> : <ListItem>{project.title}</ListItem>;
};

ProjectItem.propTypes = {
  project: PropTypes.object
};

export default ProjectItem;
