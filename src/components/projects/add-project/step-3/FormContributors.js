import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

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

const styles = theme => ({
  paper: { ...theme.customs.paper },
  title: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  primary: {
    color: theme.palette.primary.main
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
      classes
    } = this.props;

    return (
      <GridContainer>
        <Grid item>
          <Paper className={classes.paper}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.title}
            >
              Looking for <span className={classes.primary}>contributors?</span>
            </Typography>
            <Switch checked={checked} onChange={handleSwitchChange} />
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
              multiline
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.prevStep}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.onSubmit}
              className={classes.button}
            >
              Submit
            </Button>
          </Paper>
        </Grid>
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
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { clearErrors, setError }
  )
)(FormContributors);
