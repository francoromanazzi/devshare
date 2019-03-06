import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import isEmpty from '../../../../utils/is-empty';
import { setError, clearErrors } from '../../../../store/actions/errorsActions';

import {
  withStyles,
  Grid,
  TextField,
  Button,
  Typography,
  Paper
} from '@material-ui/core';

import GridContainer from '../../../common/grid-container/GridContainer';
import GithubRepoList from './GithubRepoList';

const styles = theme => ({
  paper: { ...theme.customs.paper },
  title: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  subtitle: {
    marginTop: theme.spacing.unit * 4
  },
  primary: {
    color: theme.palette.primary.main
  },
  continueButton: {
    marginTop: theme.spacing.unit * 4
  }
});

export class FormRepoSelector extends Component {
  nextStep = () => {
    this.props.clearErrors();

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
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="h2" align="center" className={classes.title}>
              Add <span className={classes.primary}>new project</span>
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
            <Typography variant="subtitle1" className={classes.subtitle}>
              or select it from here...
            </Typography>
            <GithubRepoList value={repoUrl} />
            <Button
              variant="contained"
              fullWidth
              onClick={this.nextStep}
              color="secondary"
              className={classes.continueButton}
            >
              Continue
            </Button>
          </Paper>
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
  setError: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { setError, clearErrors }
  )
)(FormRepoSelector);
