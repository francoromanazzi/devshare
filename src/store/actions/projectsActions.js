import axios from 'axios';
import {
  SET_NEW_PROJECT_REPO_URL,
  CLEAR_NEW_PROJECT_REPO_URL,
  PROJECTS_LOADING,
  GET_ERRORS,
  GET_PROJECT
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
        `https://api.github.com/repos/${username}/${repo.name}/readme`
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

          // Get images from README.md
          const readmeText = window.atob(res[0].data.content); // from base64
          console.log(readmeText);
          //const imageUrlMatches = readmeText.match(/!\[([\s\S]*?)\]/gim);
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
              console.log(res);
              newProject.images = res.map(image => image.data.download_url);
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
        .catch(err =>
          dispatch({
            type: GET_ERRORS,
            payload: { error: err.response.data }
          })
        );
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: { error: err.response.data }
      })
    );
};

// Set loading state
export const setProjectsLoading = () => {
  return {
    type: PROJECTS_LOADING
  };
};
