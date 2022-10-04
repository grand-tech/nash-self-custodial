/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {OnBoardingStack} from './src/features/onboarding/navigation.stack';
import {initTheme} from './src/ui_lib_configs/FoundationConfig';

const App = () => {
  initTheme();
  return (
    <NavigationContainer>
      <OnBoardingStack />
    </NavigationContainer>
  );
};

export default App;
