import axios from 'axios';
import {
  SET_NEW_PROJECT_REPO_URL,
  CLEAR_NEW_PROJECT_REPO_URL,
  PROJECTS_LOADING,
  PROJECTS_LOADED,
  GET_ERRORS,
  GET_PROJECT,
  DELETE_TAG_AT_INDEX,
  ADD_TAG,
  DELETE_IMAGE_AT_INDEX,
  ADD_IMAGE,
  CLEAR_PROJECT,
  CHANGE_IMAGE_TITLE,
  PROJECT_IMAGES_URLS
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

  axios
    .get(`https://api.github.com/users/${username}/repos`)
    .then(res => {
      const newProject = {};
      const reposSameUrl = res.data.filter(repo => repo.html_url === repoUrl);

      if (reposSameUrl.length === 0) {
        return dispatch({
          type: GET_ERRORS,
          payload: { repoUrl: 'Repository not found' }
        });
      }

      const repo = reposSameUrl[0];
      newProject.title = repo.name;
      newProject.description = repo.description || '';
      newProject.liveWebsiteUrl = repo.homepage || '';

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
          newProject.tags = res[1].data.names;

          // If README.md doesn't exist
          if (res[0].status === 404) {
            newProject.images = [];
            return dispatch({
              type: GET_PROJECT,
              payload: { project: newProject }
            });
          }

          // Get images from README.md
          const readmeText = window.atob(res[0].data.content); // from base64
          let imageUrlMatches = readmeText.match(
            /(\/(.*))*\.(bmp|png|jpg|jpeg)/gim
          );

          // No images in readme
          if (imageUrlMatches === null || imageUrlMatches === []) {
            newProject.images = [];
            return dispatch({
              type: GET_PROJECT,
              payload: { project: newProject }
            });
          }

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
                  /[/]([^/])+\.(bmp|png|jpg|jpeg)/gim
                )[0]; // Example: '/Picture.jpg'
                // Remove starting and ending
                imageTitle = imageTitle.slice(1, imageTitle.indexOf('.'));

                return {
                  title: imageTitle,
                  base64: image.data.content
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
                payload: { repoUrl: err.response.data }
              })
            );
        })
        .catch(err => {
          dispatch({
            type: GET_ERRORS,
            payload: { repoUrl: err.response.data }
          });
        });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: { repoUrl: err.response.data }
      })
    );
};

// Add new project
export const addNewProject = (newProject, history, { firebase, firestore }) => (
  dispatch,
  getState
) => {
  const {
    repoUrl,
    liveWebsiteUrl,
    title,
    description,
    tags,
    images,
    contributorsChecked,
    contributorsDescription
  } = newProject;

  dispatch(setProjectsLoading());

  const { auth } = getState().firebase;

  // 1. Prepare new document to save later (so that we can access the random id now)
  const docRef = firestore.collection('projects').doc();

  // 2. Add a storage reference to each image and remove base64 string
  const imagesWithStorageRefs = images.map(img => ({
    title: img.title,
    storageRef: `images/projects/${docRef.id}/${img.title.replace(
      / /g,
      '_'
    )}.jpg`
  }));

  // 3. Save project in firestore + upload images to storage (concurrently)
  const saveProjectInFirestorePromise = docRef.set({
    userId: auth.uid,
    repoUrl,
    liveWebsiteUrl,
    title,
    description,
    tags,
    imagesWithStorageRefs,
    contributorsChecked,
    contributorsDescription,
    createdAt: new Date()
  });

  const uploadImagesPromise = Promise.all(
    images.map((img, i) => {
      return firebase
        .storage()
        .ref(imagesWithStorageRefs[i].storageRef)
        .putString(img.base64, 'base64', { contentType: 'image/jpeg' });
    })
  );

  Promise.all([saveProjectInFirestorePromise, uploadImagesPromise])
    .then(() => {
      dispatch(setProjectsLoaded());
      history.push('/');
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: { repoUrl: err.response.data }
      })
    );
};

// Get all projects from firestore
export const getProjects = ({ firebase, firestore }) => (
  dispatch,
  getState
) => {
  dispatch(setProjectsLoading());
  firestore.onSnapshot(
    { collection: 'projects', orderBy: ['createdAt', 'desc'] },
    () => {
      const { projects } = getState().firestore.ordered;
      for (let project of projects) {
        const images = project.imagesWithStorageRefs;
        if (images.length > 0) {
          Promise.all(
            images.map(img => {
              return firebase
                .storage()
                .ref(img.storageRef)
                .getDownloadURL();
            })
          )
            .then(res => {
              dispatch({
                type: PROJECT_IMAGES_URLS,
                payload: { id: project.id, images: res }
              });
            })
            .catch(error => {
              dispatch({
                type: GET_ERRORS,
                payload: { error }
              });
            });
        }
      }
    },
    error => {
      dispatch({
        type: GET_ERRORS,
        payload: { error }
      });
    }
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

// Change image title of existing image
export const changeImageTitle = (oldTitle, newTitle) => {
  return {
    type: CHANGE_IMAGE_TITLE,
    payload: { oldTitle, newTitle }
  };
};

// Set loading state
export const setProjectsLoading = () => {
  return {
    type: PROJECTS_LOADING
  };
};

// End loading state
export const setProjectsLoaded = () => {
  return {
    type: PROJECTS_LOADED
  };
};

// Clear current project
export const clearProject = () => {
  return {
    type: CLEAR_PROJECT
  };
};
