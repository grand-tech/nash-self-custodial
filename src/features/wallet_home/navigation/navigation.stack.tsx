import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WalletHomeNavigationStackParamsList} from './navigation.params.type';
import RequestMoneyScreen from '../screens/RequestMoneyScreen';
import WalletHomeScreen from '../screens/WalletHomeScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import EnterAddressScreen from '../screens/EnterAddressScreen';
import ReviewSendTransaction from '../screens/ReviewSendTransaction';

const Stack = createNativeStackNavigator<WalletHomeNavigationStackParamsList>();

export const WalletHomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="WalletHomeScreen">
      {navigationStack}
    </Stack.Navigator>
  );
};

/**
 * Hides the header.
 */
const RootStackScreenHideHeader = {
  headerShown: false,
};

const navigationStack = (
  <>
    <Stack.Screen
      name="WalletHomeScreen"
      component={WalletHomeScreen}
      options={RootStackScreenHideHeader}
    />
    <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
    <Stack.Screen name="RequestMoney" component={RequestMoneyScreen} />
    <Stack.Screen
      name="ReviewSendTransaction"
      component={ReviewSendTransaction}
    />
    <Stack.Screen name="EnterAddressScreen" component={EnterAddressScreen} />
  </>
);
