import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { get } from 'lodash';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import firebaseConfig from '../../config/firebaseConfig';
import rootReducer from '../reducers';

const customAuthIsReady = (store, { firebaseStateName }) =>
  new Promise(resolve => {
    if (
      get(store.getState(), `${firebaseStateName}.auth.isLoaded`) &&
      get(store.getState(), `${firebaseStateName}.profile.isLoaded`)
    ) {
      resolve();
    } else {
      const unsubscribe = store.subscribe(() => {
        if (
          get(store.getState(), `${firebaseStateName}.auth.isLoaded`) &&
          get(store.getState(), `${firebaseStateName}.profile.isLoaded`)
        ) {
          unsubscribe();
          resolve();
        }
      });
    }
  });

export default () =>
  createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
      reduxFirestore(firebaseConfig),
      reactReduxFirebase(firebaseConfig, {
        userProfile: 'users',
        useFirestoreForProfile: true,
        attachAuthIsReady: true,
        authIsReady: customAuthIsReady
      })
    )
  );
