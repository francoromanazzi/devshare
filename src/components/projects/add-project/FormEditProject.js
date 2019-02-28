import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isEmpty from '../../../utils/is-empty';
import { getFullRepoFromUserByUrl } from '../../../store/actions/projectsActions';

import {
  withStyles,
  Grid,
  TextField,
  Button,
  Typography
} from '@material-ui/core';
import GridContainer from '../../common/grid-container/GridContainer';
import Spinner from '../../common/spinner/Spinner';

export class FormEditProject extends Component {
  nextStep = () => {
    this.props.nextStep();
  };

  componentDidMount() {
    const { repoUrl, username, getFullRepoFromUserByUrl } = this.props;

    getFullRepoFromUserByUrl(username, repoUrl);
  }

  render() {
    const {
      values: { title, description, pictures, tags },
      repoUrl,
      handleChange,
      errors,
      prevStep,
      projects: { project, loading }
    } = this.props;

    const content = loading ? (
      <Spinner />
    ) : (
      <GridContainer>
        <Grid item>
          <TextField
            placeholder="Enter project title here"
            label={!isEmpty(errors.title) ? errors.title : 'Project title'}
            name="title"
            onChange={handleChange}
            fullWidth
            value={title}
            error={!isEmpty(errors.title)}
          />
          <Button variant="contained" onClick={prevStep}>
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
  errors: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  username: state.firebase.profile.username,
  errors: state.errors,
  projects: state.projects
});

export default connect(
  mapStateToProps,
  { getFullRepoFromUserByUrl }
)(FormEditProject);
