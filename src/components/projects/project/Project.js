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
import {
  withStyles,
  withWidth,
  Grid,
  Paper,
  Typography,
  Chip,
  GridList,
  GridListTile,
  GridListTileBar,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Icon
} from '@material-ui/core';

const styles = theme => ({
  paper: { ...theme.customs.paper },
  primary: {
    color: theme.palette.primary.main
  },
  secondary: {
    color: theme.palette.secondary.dark
  },
  title: {
    marginBottom: theme.spacing.unit * 4
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
  whiteText: {
    color: theme.palette.common.white
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0) 100%)'
  },
  githubButton: {
    //backgroundColor: theme.palette.common.white
  },
  githubIcon: {
    color: theme.palette.common.black,
    fontSize: '125%'
  },
  websiteButton: {
    marginRight: theme.spacing.unit
  },
  websiteIcon: {
    color: theme.palette.common.white,
    fontSize: '125%'
  },
  grow: {
    [theme.breakpoints.up('sm')]: {
      flexGrow: 1
    }
  },
  header: {
    marginBottom: theme.spacing.unit * 2
  },
  paperLight: {
    ...theme.customs.paper,
    paddingTop: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paperLight
  },
  createdBy: {
    paddingTop: theme.spacing.unit * 2,
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing.unit * 2
    }
  }
});

export class Project extends Component {
  state = {
    zoomDialog: {
      open: false,
      currentImg: {}
    }
  };

  handleZoomOpen = img => {
    this.setState(prevState => ({
      zoomDialog: {
        ...prevState.zoomDialog,
        open: true,
        currentImg: img
      }
    }));
  };

  handleZoomClose = () => {
    this.setState(prevState => ({
      zoomDialog: {
        ...prevState.zoomDialog,
        open: false,
        currentImg: {}
      }
    }));
  };

  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
  }

  render() {
    const {
      projects: { loading, project, projectsImages },
      classes,
      users,
      width
    } = this.props;
    const { zoomDialog } = this.state;

    const usernameAvailable =
      !isEmpty(users) && users.some(user => user.id === project.userId);

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

    const dialogZoomViewContent = (
      <Dialog
        open={zoomDialog.open}
        onClose={this.handleZoomClose}
        maxWidth="md"
      >
        <DialogContent>
          {zoomDialog.currentImg && (
            <img
              src={zoomDialog.currentImg.url}
              alt={zoomDialog.currentImg.title}
              style={{ width: '100%' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleZoomClose}
            color="inherit"
            className={classes.whiteText}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );

    const content =
      loading || isEmpty(project.createdAt) || !usernameAvailable ? (
        <Spinner />
      ) : (
        <GridContainer>
          <Grid item>
            <Paper className={classes.paper}>
              <Grid container className={classes.header} justify="flex-end">
                <Grid item xs={12} sm={7}>
                  <Typography variant="body2" className={classes.createdBy}>
                    {moment(project.createdAt.toDate()).calendar() +
                      ' by ' +
                      users.filter(user => user.id === project.userId)[0]
                        .username}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Grid
                    container
                    alignItems="flex-start"
                    justify={width === 'xs' ? 'flex-start' : 'flex-end'}
                  >
                    {!isEmpty(project.liveWebsiteUrl) && (
                      <IconButton
                        color="inherit"
                        className={classes.websiteButton}
                      >
                        <a
                          href={project.liveWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon
                            className={classNames(
                              'fas fa-globe',
                              classes.websiteIcon
                            )}
                          />
                        </a>
                      </IconButton>
                    )}

                    {!isEmpty(project.repoUrl) && (
                      <IconButton
                        color="inherit"
                        className={classes.githubButton}
                      >
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon
                            className={classNames(
                              'fab fa-github',
                              classes.githubIcon
                            )}
                          />
                        </a>
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Typography
                variant="h3"
                gutterBottom
                align="center"
                className={classNames(classes.title, classes.primary)}
              >
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
                          onClick={this.handleZoomOpen.bind(this, img)}
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
              <Paper className={classes.paperLight}>
                {project.contributorsChecked ? (
                  <React.Fragment>
                    <Typography
                      className={classNames(classes.secondary)}
                      color="inherit"
                      variant="h6"
                    >
                      Looking for contributors!
                    </Typography>
                    <Typography
                      className={classes.whiteText}
                      color="inherit"
                      variant="body1"
                    >
                      {project.contributorsDescription}
                    </Typography>
                  </React.Fragment>
                ) : (
                  <Typography
                    className={classNames(classes.secondary)}
                    color="inherit"
                    variant="h6"
                  >
                    Not looking for contributors
                  </Typography>
                )}
              </Paper>

              {dialogZoomViewContent}
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
  withWidth(),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Project);
