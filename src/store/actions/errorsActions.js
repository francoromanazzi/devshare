import {
  GET_ERRORS,
  CLEAR_ERRORS,
  CLEAR_SPECIFIC_ERRORS
} from '../actions/types';

// Publish a new error
export const setError = error => dispatch => {
  dispatch({ type: GET_ERRORS, payload: error });
};

// Clear all errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Clear given errors
// @param errors: ['title', 'description']
export const clearSpecificErrors = errors => {
  return {
    type: CLEAR_SPECIFIC_ERRORS,
    payload: errors
  };
};
