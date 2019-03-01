import {
  SET_NEW_PROJECT_REPO_URL,
  CLEAR_NEW_PROJECT_REPO_URL,
  PROJECTS_LOADING,
  GET_PROJECT,
  DELETE_TAG_AT_INDEX,
  ADD_TAG,
  DELETE_IMAGE_AT_INDEX,
  ADD_IMAGE
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
    case DELETE_TAG_AT_INDEX:
      return {
        ...state,
        project: {
          ...state.project,
          tags: state.project.tags.filter((tag, i) => i !== action.payload)
        }
      };
    case ADD_TAG:
      return {
        ...state,
        project: {
          ...state.project,
          tags: [...state.project.tags, action.payload]
        }
      };
    case DELETE_IMAGE_AT_INDEX:
      return {
        ...state,
        project: {
          ...state.project,
          images: state.project.images.filter((img, i) => i !== action.payload)
        }
      };
    case ADD_IMAGE:
      return {
        ...state,
        project: {
          ...state.project,
          images: [...state.project.images, action.payload]
        }
      };
    default:
      return state;
  }
}
