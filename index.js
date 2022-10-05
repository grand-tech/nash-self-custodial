/**
 * @format
 */
import 'node-libs-react-native/globals';
import './global';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './src/app-redux-store/store';
import {store} from './src/app-redux-store/store';
import {Provider} from 'react-redux';
import RehydrationLoadingScreen from './src/app_components/RehydrationLoadingScreen';

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <PersistGate loading={<RehydrationLoadingScreen />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
));
