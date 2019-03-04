import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isEmpty from '../../../../utils/is-empty';
import {
  getFullRepoFromUserByUrl,
  deleteTagAtIndex
} from '../../../../store/actions/projectsActions';
import { setError, clearErrors } from '../../../../store/actions/errorsActions';

import { Grid, Typography, TextField, Button } from '@material-ui/core';
import GridContainer from '../../../common/grid-container/GridContainer';
import Spinner from '../../../common/spinner/Spinner';
import Tags from './Tags';
import ImageGallery from './ImageGallery';

export class FormEditProject extends Component {
  nextStep = () => {
    this.props.nextStep();
  };

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
    this.props.prevStep();
  };

  render() {
    const {
      values: { title, liveWebsiteUrl, description, images, tags },
      handleChange,
      errors,
      projects: { project, loading }
    } = this.props;

    const content = loading ? (
      <Spinner />
    ) : (
      <GridContainer>
        <Grid item>
          <Typography
            variant="h2"
            gutterBottom
            align="center"
            style={{ margin: '30px 0px' }}
          >
            Make adjustments
          </Typography>
          <TextField
            placeholder="Enter project title here"
            label={!isEmpty(errors.title) ? errors.title : 'Project title'}
            name="title"
            onChange={handleChange}
            fullWidth
            value={title}
            error={!isEmpty(errors.title)}
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
            multiline
          />
          <TextField
            placeholder="Enter live website url here"
            label="Live website URL"
            name="liveWebsiteUrl"
            onChange={handleChange}
            fullWidth
            value={liveWebsiteUrl}
          />
          <Tags tags={tags} />
          <ImageGallery images={images} />
          <Button variant="contained" onClick={this.prevStep}>
            Back
          </Button>
          <Button variant="contained" onClick={this.nextStep}>
            Continue
          </Button>
        </Grid>
      </GridContainer>
    );

    return content;
  }
}

FormEditProject.propTypes = {
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
  errors: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  refetchRepo: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  username: state.firebase.profile.username,
  errors: state.errors,
  projects: state.projects
});

export default connect(
  mapStateToProps,
  { getFullRepoFromUserByUrl, deleteTagAtIndex, setError, clearErrors }
)(FormEditProject);
