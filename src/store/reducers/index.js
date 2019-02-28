import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import reposReducer from './reposReducer';
import errorsReducer from './errorsReducer';
import projectsReducer from './projectsReducer';

export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  repos: reposReducer,
  errors: errorsReducer,
  projects: projectsReducer
});
