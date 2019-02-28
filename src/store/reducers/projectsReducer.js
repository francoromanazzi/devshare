import {
  SET_NEW_PROJECT_REPO_URL,
  CLEAR_NEW_PROJECT_REPO_URL,
  PROJECTS_LOADING,
  GET_PROJECT
} from '../actions/types';

const initState = {
  projects: [],
  project: {},
  loading: false
};

export default function(state = initState, action) {
  switch (action.type) {
    case SET_NEW_PROJECT_REPO_URL:
      return {
        ...state,
        project: {
          ...state.newProject,
          repoUrl: action.payload
        }
      };
    case CLEAR_NEW_PROJECT_REPO_URL:
      return {
        ...state,
        project: {
          ...state.newProject,
          repoUrl: ''
        }
      };
    case PROJECTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload.project,
        loading: false
      };
    default:
      return state;
  }
}
