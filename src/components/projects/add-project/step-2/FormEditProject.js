import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import isEmpty from '../../../../utils/is-empty';
import {
  getFullRepoFromUserByUrl,
  deleteTagAtIndex,
  clearProject
} from '../../../../store/actions/projectsActions';
import { setError, clearErrors } from '../../../../store/actions/errorsActions';

import {
  withStyles,
  Grid,
  Typography,
  TextField,
  Button,
  Paper
} from '@material-ui/core';
import GridContainer from '../../../common/grid-container/GridContainer';
import Spinner from '../../../common/spinner/Spinner';
import Tags from './Tags';
import ImageGallery from './ImageGallery';

const styles = theme => ({
  paper: { ...theme.customs.paper, marginTop: 0 },
  primary: {
    color: theme.palette.primary.main
  },
  title: {
    marginBottom: theme.spacing.unit * 4
  },
  input: {
    marginTop: theme.spacing.unit * 4
  },
  button: {
    marginTop: theme.spacing.unit * 4
  }
});

export class FormEditProject extends Component {
  componentDidMount() {
    const {
      repoUrl,
      refetchRepo,
      username,
      getFullRepoFromUserByUrl
    } = this.props;

    if (refetchRepo) getFullRepoFromUserByUrl(username, repoUrl);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.errors.repoUrl)) {
      this.props.prevStep();
    }
  }

  validateInputs = () => {
    let errors = false;

    if (this.props.values.title.length === 0) {
      errors = true;
      this.props.setError({ title: 'Title is required' });
    }
    if (this.props.values.description.length === 0) {
      errors = true;
      this.props.setError({ description: 'Description is required' });
    }

    return !errors;
  };

  nextStep = () => {
    this.props.clearErrors();
    if (this.validateInputs()) this.props.nextStep();
  };

  prevStep = () => {
    this.props.clearErrors();
    this.props.clearProject();
    this.props.prevStep();
  };

  render() {
    const {
      values: { title, liveWebsiteUrl, description, images, tags },
      handleChange,
      errors,
      projects: { loading },
      classes
    } = this.props;

    const content = loading ? (
      <Spinner />
    ) : (
      <GridContainer>
        <Grid item>
          <Paper className={classes.paper}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.title}
            >
              Make <span className={classes.primary}>adjustments</span>
            </Typography>
            <TextField
              placeholder="Enter project title here"
              label={!isEmpty(errors.title) ? errors.title : 'Project title'}
              name="title"
              onChange={handleChange}
              fullWidth
              value={title}
              error={!isEmpty(errors.title)}
              className={classes.input}
              required
            />
            <TextField
              placeholder="Enter project description here"
              label={
                !isEmpty(errors.description)
                  ? errors.description
                  : 'Project description'
              }
              name="description"
              onChange={handleChange}
              fullWidth
              value={description}
              error={!isEmpty(errors.description)}
              className={classes.input}
              required
              multiline
            />
            <TextField
              placeholder="Enter live website url here"
              label="Live website URL"
              name="liveWebsiteUrl"
              onChange={handleChange}
              fullWidth
              value={liveWebsiteUrl}
              className={classes.input}
            />
            <Tags tags={tags} />
            <ImageGallery images={images} />
            <Grid container spacing={16}>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.prevStep}
                  className={classes.button}
                  fullWidth
                >
                  <i
                    className="fas fa-arrow-left"
                    style={{ fontSize: '1.1em', marginRight: '0.5em' }}
                  />
                  Back
                </Button>
              </Grid>
              <Grid item xs={9}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.nextStep}
                  className={classes.button}
                  fullWidth
                >
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </GridContainer>
    );

    return content;
  }
}

FormEditProject.propTypes = {
  classes: PropTypes.object.isRequired,
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  repoUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  getFullRepoFromUserByUrl: PropTypes.func.isRequired,
  deleteTagAtIndex: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  refetchRepo: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  username: state.firebase.profile.username,
  errors: state.errors,
  projects: state.projects
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    {
      getFullRepoFromUserByUrl,
      deleteTagAtIndex,
      setError,
      clearErrors,
      clearProject
    }
  )
)(FormEditProject);
