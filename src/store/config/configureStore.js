import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
//import { getFirestore } from 'redux-firestore';
//import { getFirebase } from 'react-redux-firebase';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import rootReducer from '../reducers';

export default () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
