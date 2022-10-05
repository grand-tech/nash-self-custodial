/* eslint-disable react/react-in-jsx-scope */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateAccountScreen from './screens/CreateAccountScreen';
import StartScreen from './screens/StartScreen';

const Stack = createNativeStackNavigator();

/**
 * Hides the header.
 */
const stackScreenHideHeader = {
  headerShown: false,
};

export function OnBoardingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={stackScreenHideHeader}
      />
      <Stack.Screen
        name="SelectGenerateOrRestoreAccount"
        component={CreateAccountScreen}
      />
    </Stack.Navigator>
  );
}
