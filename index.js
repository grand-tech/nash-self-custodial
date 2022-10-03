/**
 * @format
 */
import 'node-libs-react-native/globals';
import './global';
import {AppRegistry, Text} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './src/app-redux-store/store';
import {store} from './src/app-redux-store/store';
import {Provider} from 'react-redux';

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <PersistGate loading={<Text>'Loading ..'</Text>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
));
