import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsHomeScreen from '../SettingsHomeScreen';
import DisplayAccountAddress from '../DisplayAccountAddress';
import DisplayPrivateKeyAndMnemonic from '../DisplayPrivateKeyAndMnemonic';
import {SettingsNavigationStackParamsList} from './navigation.params.type';
import EnterMpesaPaymentInfoScreen from '../../ramp_payment_information/screens/EnterMpesaPaymentInfoScreen';

const Stack = createNativeStackNavigator<SettingsNavigationStackParamsList>();

export const SettingsStack = () => {
  return (
    <Stack.Navigator initialRouteName="SettingsHome">
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
      name="SettingsHome"
      component={SettingsHomeScreen}
      options={RootStackScreenHideHeader}
    />
    <Stack.Screen
      name="DisplayAccountAddress"
      component={DisplayAccountAddress}
    />
    <Stack.Screen
      name="DisplayPrivateKeyAndMnemonic"
      component={DisplayPrivateKeyAndMnemonic}
    />
    <Stack.Screen
      name="EnterMpesaPaymentInfoScreen"
      component={EnterMpesaPaymentInfoScreen}
    />
  </>
);
