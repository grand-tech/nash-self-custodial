import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EnterAmountScreen from '../EnterAmountScreen';
import MakeRequestScreen from '../DisplayAccountAddress';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation.params.type';
import TransactionsFeedScreen from '../TransactionsFeedScreen';

const Stack =
  createNativeStackNavigator<WithdrawalAndDepositNavigationStackParamsList>();

export const WithdrawalAndDepositStack = () => {
  return (
    <Stack.Navigator initialRouteName="TransactionsFeedScreen">
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
      name="TransactionsFeedScreen"
      component={TransactionsFeedScreen}
      options={RootStackScreenHideHeader}
    />
    <Stack.Screen name="EnterAmountScreen" component={EnterAmountScreen} />
    <Stack.Screen name="MakeRequestScreen" component={MakeRequestScreen} />
  </>
);
