import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../features/onboarding/navigation/navigation.params.type';
import {onboardingNavigationStack} from '../features/onboarding/navigation/navigation.stack';

/**
 * The apps root navigation stack.
 */
export const RootStack =
  createNativeStackNavigator<OnboardingNavigationStackParamsList>();

// TODO https://reactnavigation.org/docs/typescript/
export const RootNavigationStack = () => {
  return <RootStack.Navigator>{onboardingNavigationStack}</RootStack.Navigator>;
};
