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
import React, {type PropsWithChildren} from 'react';
import { StyleSheet } from 'react-native';
import { OnBoardingStack } from './src/features/onboarding/navigation.stack';

const App = () => {

  return (
    <NavigationContainer>
      <OnBoardingStack></OnBoardingStack>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
});

export default App;
