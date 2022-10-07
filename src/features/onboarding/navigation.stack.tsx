/* eslint-disable react/react-in-jsx-scope */
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import CreateAccountScreen from './screens/CreateAccountScreen';
import StartScreen from './screens/StartScreen';
import {AppColors} from '../../ui_lib_configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Pressable} from 'react-native';
import {TermsAndConditions} from './screens/TermsAndConditions';
import {EnterUserNameScreen} from './screens/EnterUserNameScreen';

const Stack = createNativeStackNavigator();

/**
 * Hides the header.
 */
const stackScreenHideHeader = {
  headerShown: false,
};

export function stackScreenHideHeaderTitle(
  onPress: any,
): NativeStackNavigationOptions {
  return {
    title: '',
    headerTransparent: true,
    headerLeft: () => <BackButton onPress={onPress} />,
  };
}

export const OnBoardingStack = () => {
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
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
      <Stack.Screen
        name="EnterUserName"
        component={EnterUserNameScreen}
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
    </Stack.Navigator>
  );
};

/**
 * Props expected by custom back button.
 */
interface BackButtonProps {
  onPress: any;
}

/**
 * Custom back button.
 */
export const BackButton: React.FC<BackButtonProps> = props => {
  return (
    <Pressable
      onPress={() => {
        props.onPress();
      }}>
      <Icon name="chevron-left" size={30} color={AppColors.green} />
    </Pressable>
  );
};
