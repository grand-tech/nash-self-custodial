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
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationDrawer} from './src/features/navigation_drawer/navigation_drawer';
import {RootNavigationStack} from './src/navigation/root.navigation.stack';
import {initTheme} from './src/ui_lib_configs/FoundationConfig';
import {RootState} from './src/app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';
import {OnboardingStatusNames} from './src/features/onboarding/redux_store/reducers';

const App: React.FC<Props> = (props: Props) => {
  initTheme();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      {props.onboarding_status === OnboardingStatusNames.onboarding_complete ? (
        <NavigationDrawer />
      ) : (
        <RootNavigationStack />
      )}
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootState) => ({
  onboarding_status: state.onboarding.status.name,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {}

export default connect(mapStateToProps, mapDispatchToProps)(App);
