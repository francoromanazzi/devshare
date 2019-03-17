import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createFirestoreInstance } from 'redux-firestore';

import theme from './theme/theme';
import configureStore from './store/config/configureStore';
import firebaseConfig from './config/firebaseConfig';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

const store = configureStore();

const rrfProps = {
  firebase: firebaseConfig,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
    attachAuthIsReady: true
  },
  createFirestoreInstance,
  dispatch: store.dispatch
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <App />
        </CssBaseline>
      </MuiThemeProvider>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
