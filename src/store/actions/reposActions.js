import axios from 'axios';

import { GET_REPOS, REPOS_LOADING, GET_ERRORS } from '../actions/types';

// Get all repositories from user
export const getReposFromUser = username => dispatch => {
  dispatch(setReposLoading());

  axios
    .get(`https://api.github.com/users/${username}/repos`, {
      params: {
        sort: 'updated'
      }
    })
    .then(res => {
      dispatch({
        type: GET_REPOS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: { error: err.response.data }
      });
    });
};

// Set loading state
export const setReposLoading = () => {
  return {
    type: REPOS_LOADING
  };
};
