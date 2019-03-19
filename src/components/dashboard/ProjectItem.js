import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEmpty from '../../utils/is-empty';

import {
  withStyles,
  Paper,
  Typography,
  Chip,
  GridList,
  GridListTile,
  GridListTileBar
} from '@material-ui/core';
import Spinner from '../common/spinner/Spinner';

const styles = theme => ({
  paper: {
    ...theme.customs.paper
  },
  primary: {
    color: theme.palette.primary.main
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  },
  images: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  title: {
    color: theme.palette.common.white
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0) 100%)'
  }
});

const ProjectItem = ({ classes, project, projectsImages }) => {
  const projectImagesMetadata = projectsImages.filter(
    _project => _project.id === project.id
  );
  const projectImages =
    projectImagesMetadata.length > 0
      ? projectImagesMetadata[0].images.map((img, i) => ({
          title: project.imagesWithStorageRefs[i].title,
          url: img
        }))
      : [];
  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" color="inherit" className={classes.primary}>
        {project.title}
      </Typography>
      <Typography variant="subtitle1">{project.description}</Typography>
      {!isEmpty(project.tags) && (
        <div className={classes.tags}>
          {project.tags.map((tag, i) => (
            <Chip key={i} label={tag} className={classes.chip} />
          ))}
        </div>
      )}
      {!isEmpty(projectImages) ? (
        <div className={classes.images}>
          <GridList className={classes.gridList}>
            {projectImages.map((img, i) => (
              <GridListTile key={i}>
                <img
                  src={img.url}
                  alt={img.title}
                  /*onClick={this.handleZoomOpen.bind(this, img)}*/
                  style={{ cursor: 'pointer' }}
                />

                <GridListTileBar
                  title={img.title}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title
                  }}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      ) : !isEmpty(project.imagesWithStorageRefs) ? (
        <Spinner />
      ) : null}
    </Paper>
  );
};

ProjectItem.propTypes = {
  classes: PropTypes.object.isRequired,
  project: PropTypes.object
};

const mapStateToProps = state => ({
  projectsImages: state.projects.projectsImages
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ProjectItem);
