import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isEmpty from '../../../../utils/is-empty';
import { setError, clearErrors } from '../../../../store/actions/errorsActions';

import { Grid, Typography, Switch, TextField, Button } from '@material-ui/core';
import GridContainer from '../../../common/grid-container/GridContainer';

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
            Looking for contributors?
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
          <Button variant="contained" onClick={this.prevStep}>
            Back
          </Button>
          <Button variant="contained" onClick={this.onSubmit}>
            Submit
          </Button>
        </Grid>
      </GridContainer>
    );
  }
}

FormContributors.propTypes = {
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

export default connect(
  mapStateToProps,
  { clearErrors, setError }
)(FormContributors);
