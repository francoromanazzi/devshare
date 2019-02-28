import { REPOS_LOADING, GET_REPOS } from '../actions/types';

const initState = {
  repos: [],
  loading: false
};

export default function(state = initState, action) {
  switch (action.type) {
    case REPOS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
