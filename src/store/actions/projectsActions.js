import axios from 'axios';
import {
  SET_NEW_PROJECT_REPO_URL,
  CLEAR_NEW_PROJECT_REPO_URL,
  PROJECTS_LOADING,
  GET_ERRORS,
  GET_PROJECT,
  DELETE_TAG_AT_INDEX,
  ADD_TAG,
  DELETE_IMAGE_AT_INDEX,
  ADD_IMAGE
} from '../actions/types';

// Set github repo url when adding a new project
export const setNewProjectRepoUrl = url => dispatch => {
  dispatch({ type: SET_NEW_PROJECT_REPO_URL, payload: url });
};

// Clear github repo url when adding a new project
// (because it was already consumed by AddProject)
export const clearNewProjectRepoUrl = () => dispatch => {
  dispatch({ type: CLEAR_NEW_PROJECT_REPO_URL });
};

export const getFullRepoFromUserByUrl = (username, repoUrl) => dispatch => {
  dispatch(setProjectsLoading());

  console.log(username, repoUrl);

  axios
    .get(`https://api.github.com/users/${username}/repos`)
    .then(res => {
      const newProject = {};
      const reposSameUrl = res.data.filter(repo => repo.html_url === repoUrl);

      if (reposSameUrl.length === 0) {
        return dispatch({
          type: GET_ERRORS,
          payload: { error: 'Repository not found' }
        });
      }

      const repo = reposSameUrl[0];
      newProject.title = repo.name;
      newProject.description = repo.description;

      console.log(repo);

      const readmePromise = axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/readme`,
        { validateStatus: false }
      );
      const topicsPromise = axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/topics`,
        {
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json'
          }
        }
      );

      Promise.all([readmePromise, topicsPromise])
        .then(res => {
          console.log(res);

          newProject.tags = res[1].data.names;

          // If README.md doesn't exist
          if (res[0].status == 404) {
            newProject.images = [];
            return dispatch({
              type: GET_PROJECT,
              payload: { project: newProject }
            });
          }

          // Get images from README.md
          const readmeText = window.atob(res[0].data.content); // from base64
          console.log(readmeText);
          let imageUrlMatches = readmeText.match(
            /(\/(.*))*\.(bmp|png|jpg|jpeg)/gim
          );
          console.log(imageUrlMatches);

          imageUrlMatches = imageUrlMatches.map(imageUrl =>
            axios.get(
              `https://api.github.com/repos/${username}/${
                repo.name
              }/contents${imageUrl}`
            )
          );

          Promise.all(imageUrlMatches)
            .then(res => {
              newProject.images = res.map(image => {
                // Get image title from url
                let imageTitle = image.data.download_url.match(
                  /\/([^\/])+\.(bmp|png|jpg|jpeg)/gim
                )[0]; // Example: '/Picture.jpg'
                // Remove starting and ending
                imageTitle = imageTitle.slice(1, imageTitle.indexOf('.'));

                return {
                  title: imageTitle,
                  url: image.data.download_url
                };
              });
              dispatch({
                type: GET_PROJECT,
                payload: { project: newProject }
              });
            })
            .catch(err =>
              dispatch({
                type: GET_ERRORS,
                payload: { error: err.response.data }
              })
            );
        })
        .catch(err => {
          dispatch({
            type: GET_ERRORS,
            payload: { error: err.response.data }
          });
        });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: { error: err.response.data }
      })
    );
};

// Remove tag from tags array
export const deleteTagAtIndex = i => {
  return {
    type: DELETE_TAG_AT_INDEX,
    payload: i
  };
};

// Add new tag
export const addNewTag = tag => {
  return {
    type: ADD_TAG,
    payload: tag
  };
};

// Remove image from images array
export const deleteImageAtIndex = i => {
  return {
    type: DELETE_IMAGE_AT_INDEX,
    payload: i
  };
};

// Add new image
export const addNewImage = img => {
  return {
    type: ADD_IMAGE,
    payload: img
  };
};

// Set loading state
export const setProjectsLoading = () => {
  return {
    type: PROJECTS_LOADING
  };
};
