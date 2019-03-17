import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import isEmpty from '../../../../utils/is-empty';
import { setError, clearErrors } from '../../../../store/actions/errorsActions';

import {
  withStyles,
  Grid,
  Typography,
  Switch,
  TextField,
  Button,
  Paper
} from '@material-ui/core';
import GridContainer from '../../../common/grid-container/GridContainer';
import Spinner from '../../../common/spinner/Spinner';

const styles = theme => ({
  paper: { ...theme.customs.paper, marginTop: 0 },
  primary: {
    color: theme.palette.primary.main
  },
  title: {
    marginBottom: theme.spacing.unit * 4
  },
  switch: {
    marginTop: theme.spacing.unit * 4
  },
  description: {
    marginBottom: theme.spacing.unit * 4
  },
  button: {
    marginTop: theme.spacing.unit * 4
  }
});

export class FormContributors extends Component {
  prevStep = () => {
    this.props.prevStep({ refetchRepoInStep2: false });
  };

  onSubmit = () => {
    const {
      values: { checked, description },
      setError,
      onSubmit
    } = this.props;

    this.props.clearErrors();

    // Validate inputs
    if (checked === true && description.length === 0) {
      setError({
        contributorsDescription: 'Description is required if checked'
      });
      return;
    }

    onSubmit();
  };

  render() {
    const {
      handleChange,
      handleSwitchChange,
      values: { checked, description },
      errors,
      classes,
      loading
    } = this.props;

    const content = loading ? (
      <Spinner />
    ) : (
      <Paper className={classes.paper}>
        <Typography
          variant="h2"
          gutterBottom
          align="center"
          className={classes.title}
        >
          Looking for <span className={classes.primary}>contributors?</span>
        </Typography>
        <Grid container justify="center">
          <Switch
            checked={checked}
            onChange={handleSwitchChange}
            className={classes.switch}
          />
        </Grid>
        <TextField
          placeholder="Enter description here"
          label={
            !isEmpty(errors.contributorsDescription)
              ? errors.contributorsDescription
              : 'Description'
          }
          disabled={!checked}
          name="contributorsDescription"
          onChange={handleChange}
          fullWidth
          value={description}
          error={!isEmpty(errors.contributorsDescription)}
          required={checked}
          className={classes.description}
          multiline
          rows={2}
          rowsMax={20}
        />
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
              onClick={this.onSubmit}
              className={classes.button}
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <GridContainer>
        <Grid item>{content}</Grid>
      </GridContainer>
    );
  }
}

FormContributors.propTypes = {
  classes: PropTypes.object.isRequired,
  prevStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSwitchChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  loading: state.projects.loading
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    { clearErrors, setError }
  )
)(FormContributors);
