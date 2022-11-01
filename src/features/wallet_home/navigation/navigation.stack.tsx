import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WalletHomeNavigationStackParamsList} from './navigation.params.type';
import WalletHomeScreen from '../SendMoneyScreen';
import RequestMoneyScreen from '../RequestMoneyScreen';
import SendMoneyScreen from '../SendMoneyScreen';

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
  </>
);
