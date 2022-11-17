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
import {ContractEventsListenerKit} from './src/utils/NashContractEventsKit';
import {
  generateActionQueryMyTransactions,
  generateActionQueryPendingTransactions,
} from './src/features/withdraw_and_deposit/redux_store/action.generators';

LogBox.ignoreLogs([
  "Warning: The provided value 'moz",
  "Warning: The provided value 'ms-stream",
  "The provided value 'moz-chunked-arraybuffer'",
  "The provided value 'ms-stream' is not a valid",
]);

const App: React.FC<Props> = (props: Props) => {
  initTheme();
  NashContractKit.createInstance();
  ReadContractDataKit.createInstance();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (props.publicAddress !== '') {
      ContractEventsListenerKit.createInstance();
      props.dispatchFetchPendingTransactions('refetch');
      props.dispatchFetchMyTransactions('refetch', [0, 1, 2]);
    }
  }, [props, props.publicAddress]);

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
  publicAddress: state.onboarding.publicAddress,
});

const mapDispatchToProps = {
  dispatchFetchMyTransactions: generateActionQueryMyTransactions,
  dispatchFetchPendingTransactions: generateActionQueryPendingTransactions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {}

export default connect(mapStateToProps, mapDispatchToProps)(App);
