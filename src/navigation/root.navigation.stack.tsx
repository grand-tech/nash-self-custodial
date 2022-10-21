import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {onboardingNavigationStack} from '../features/onboarding/navigation.stack';

/**
 * The apps root navigation stack.
 */
export const RootStack = createNativeStackNavigator();

// TODO https://reactnavigation.org/docs/typescript/
export const RootNavigationStack = () => {
  return <RootStack.Navigator>{onboardingNavigationStack}</RootStack.Navigator>;
};
