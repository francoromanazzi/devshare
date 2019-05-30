import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import isEmpty from '../../../utils/is-empty';

import {
  withStyles,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid
} from '@material-ui/core';
import GridContainer from '../../common/grid-container/GridContainer';

const styles = theme => ({
  stepper: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.default
  }
});

const FormStepper = ({ classes, step, errors }) => {
  return (
    <GridContainer>
      <Grid item>
        <Stepper activeStep={step - 1} className={classes.stepper}>
          <Step>
            <StepLabel error={!isEmpty(errors.repoUrl)}>
              Select repository
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              error={
                !isEmpty(errors.title) ||
                !isEmpty(errors.description) ||
                !isEmpty(errors.editImgTitle) ||
                !isEmpty(errors.imageTitle) ||
                !isEmpty(errors.imageInput) ||
                !isEmpty(errors.tag)
              }
            >
              Make adjustments
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              optional={<Typography variant="caption">Optional</Typography>}
              error={!isEmpty(errors.contributorsDescription)}
            >
              Look for contributors
            </StepLabel>
          </Step>
        </Stepper>
      </Grid>
    </GridContainer>
  );
};

FormStepper.propTypes = {
  step: PropTypes.number.isRequired, // Starting in 1
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(FormStepper);
