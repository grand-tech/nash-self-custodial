/* eslint-disable quotes */
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
import {navigationRef} from './src/navigation/navigation.service';
import {LogBox} from 'react-native';
import NashContractKit from './src/features/account_balance/contract.kit.utils';
import ReadContractDataKit from './src/features/withdraw_and_deposit/sagas/ReadContractDataKit';
import {ApolloProvider} from '@apollo/client';
import {apolloClient} from './src/features/graphql/graphql_client';

LogBox.ignoreLogs([
  "Warning: The provided value 'moz",
  "Warning: The provided value 'ms-stream",
  "The provided value 'moz-chunked-arraybuffer'",
  "The provided value 'ms-stream' is not a valid",
]);

const App: React.FC<Props> = (props: Props) => {
  initTheme();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  NashContractKit.createInstance();
  ReadContractDataKit.createInstance();

  return (
    <NavigationContainer ref={navigationRef}>
      <ApolloProvider client={apolloClient}>
        {props.onboarding_status ===
        OnboardingStatusNames.onboarding_complete ? (
          <NavigationDrawer />
        ) : (
          <RootNavigationStack />
        )}
      </ApolloProvider>
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
