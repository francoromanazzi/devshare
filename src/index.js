import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme/theme';
import configureStore from './store/config/configureStore';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

const store = configureStore();

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <App />
        </CssBaseline>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
});

serviceWorker.unregister();
