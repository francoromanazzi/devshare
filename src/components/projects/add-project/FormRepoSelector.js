import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import isEmpty from '../../../utils/is-empty';
import { setError } from '../../../store/actions/errorsActions';

import {
  withStyles,
  Grid,
  TextField,
  Button,
  Typography
} from '@material-ui/core';

import GridContainer from '../../common/grid-container/GridContainer';
import GithubRepoList from './GithubRepoList';

const styles = {
  button: {
    margin: 15
  }
};

export class FormRepoSelector extends Component {
  nextStep = () => {
    // Validate repoUrl input
    if (this.props.values.repoUrl.length === 0) {
      this.props.setError({ repoUrl: 'Repository URL is required' });
      return;
    }

    this.props.nextStep();
  };

  render() {
    const {
      classes,
      values: { repoUrl },
      handleChange,
      errors
    } = this.props;

    return (
      <GridContainer>
        <Grid item>
          <Typography
            variant="h2"
            gutterBottom
            align="center"
            style={{ margin: '30px 0px' }}
          >
            Add new project
          </Typography>
          <TextField
            placeholder="Paste your GitHub repository url here"
            label={
              !isEmpty(errors.repoUrl)
                ? errors.repoUrl
                : 'GitHub repository url'
            }
            name="repoUrl"
            onChange={handleChange}
            fullWidth
            value={repoUrl}
            error={!isEmpty(errors.repoUrl)}
          />
          <br />
          <Typography variant="subtitle1" gutterBottom>
            or select it from here...
          </Typography>
          <GithubRepoList value={repoUrl} />
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.nextStep}
          >
            Continue
          </Button>
        </Grid>
      </GridContainer>
    );
  }
}

FormRepoSelector.propTypes = {
  nextStep: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { setError }
  )
)(FormRepoSelector);
