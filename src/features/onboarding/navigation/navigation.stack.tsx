import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import StartScreen from '../screens/StartScreen';
import TermsAndConditions from '../screens/TermsAndConditions';
import EnterUserNameScreen from '../screens/EnterUserNameScreen';
import CreatePinScreen from '../screens/CreatePinScreen';
import SetUpRecoveryPhrase from '../screens/SetUpRecoveryPhrase';
import SetUpSeedPhraseInstructions from '../screens/SetUpSeedPhraseInstructions';
import WriteDownRecoveryPhraseScreen from '../screens/WriteDownRecoveryPhraseScreen';
import ConfirmRecoveryPhraseScreen from '../screens/ConfirmRecoveryPhraseScreen';
import RestoreAccountScreen from '../screens/RestoreAccountScreen';
import {RootStack} from '../../../navigation/root.navigation.stack';
import React from 'react';
import {BackButton, DeleteButton} from '../../../navigation/navigation.utils';
import EnterPaymentInformationScreen from '../../ramp_payment_information/screens/EnterPaymentInformationScreen';

/**
 * Hides the header.
 */
const RootStackScreenHideHeader = {
  headerShown: false,
};

export function RootStackScreenHideHeaderTitle(
  onPress: any,
  title?: string,
): NativeStackNavigationOptions {
  return {
    title: title ?? '',
    headerTransparent: true,
    headerLeft: () => <BackButton onPress={onPress} />,
  };
}

export function headerWithDeleteButton(
  onPressBack: any,
  onPressDelete: any,
  title?: string,
): NativeStackNavigationOptions {
  return {
    title: title ?? '',
    headerTransparent: true,
    headerLeft: () => <BackButton onPress={onPressBack} />,
    headerRight: () => <DeleteButton onPress={onPressDelete} />,
  };
}

export const onboardingNavigationStack = (
  <>
    <RootStack.Screen
      name="Start"
      component={StartScreen}
      options={RootStackScreenHideHeader}
    />
    <RootStack.Screen
      name="SelectCreateOrRestoreAccount"
      component={CreateAccountScreen}
    />
    <RootStack.Screen
      name="TermsAndConditions"
      component={TermsAndConditions}
    />
    <RootStack.Screen name="EnterUserName" component={EnterUserNameScreen} />
    <RootStack.Screen name="CreatePin" component={CreatePinScreen} />
    <RootStack.Screen
      name="SetUpRecoveryPhrase"
      component={SetUpRecoveryPhrase}
      options={RootStackScreenHideHeader}
    />
    <RootStack.Screen
      name="SetUpSeedPhraseInstructions"
      component={SetUpSeedPhraseInstructions}
      options={RootStackScreenHideHeader}
    />
    <RootStack.Screen
      name="WriteDownRecoveryPhraseScreen"
      component={WriteDownRecoveryPhraseScreen}
    />
    <RootStack.Screen
      name="ConfirmRecoveryPhraseScreen"
      component={ConfirmRecoveryPhraseScreen}
    />
    <RootStack.Screen name="RestoreAccount" component={RestoreAccountScreen} />
    <RootStack.Screen
      name="EnterFiatPaymentInformationScreen"
      component={EnterPaymentInformationScreen}
    />
  </>
);
