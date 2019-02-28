import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

// Publish a new error
export const setError = error => dispatch => {
  dispatch({ type: GET_ERRORS, payload: error });
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
