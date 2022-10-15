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
import TermsAndConditions from './screens/TermsAndConditions';
import EnterUserNameScreen from './screens/EnterUserNameScreen';
import CreatePinScreen from '../pin/screens/CreatePinScreen';
import ConfirmPinScreen from '../pin/screens/ConfirmPinScreen';
import SetUpRecoveryPhrase from './screens/SetUpRecoveryPhrase';
import SetUpSeedPhraseInstructions from './screens/SetUpSeedPhraseInstructions';
import EnterPinScreen from '../pin/screens/EnterPinScreen';
import WriteDownRecoveryPhraseScreen from './screens/WriteDownRecoveryPhraseScreen';
import ConfirmRecoveryPhraseScreen from './screens/ConfirmRecoveryPhraseScreen';
import RestoreAccountScreen from './screens/RestoreAccountScreen';

const Stack = createNativeStackNavigator();

/**
 * Hides the header.
 */
const stackScreenHideHeader = {
  headerShown: false,
};

export function stackScreenHideHeaderTitle(
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

// TODO https://reactnavigation.org/docs/typescript/
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
      <Stack.Screen
        name="CreatePin"
        component={CreatePinScreen}
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
      <Stack.Screen
        name="ConfirmPin"
        component={ConfirmPinScreen}
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
      <Stack.Screen
        name="SetUpRecoveryPhrase"
        component={SetUpRecoveryPhrase}
        options={stackScreenHideHeader}
      />
      <Stack.Screen
        name="SetUpSeedPhraseInstructions"
        component={SetUpSeedPhraseInstructions}
        options={stackScreenHideHeader}
      />
      <Stack.Screen
        name="EnterPinScreen"
        component={EnterPinScreen}
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
      <Stack.Screen
        name="WriteDownRecoveryPhraseScreen"
        component={WriteDownRecoveryPhraseScreen}
        options={({navigation, route}) =>
          stackScreenHideHeaderTitle(() => {
            navigation.goBack();
          })
        }
      />
      <Stack.Screen
        name="ConfirmRecoveryPhraseScreen"
        component={ConfirmRecoveryPhraseScreen}
      />
      <Stack.Screen name="RestoreAccount" component={RestoreAccountScreen} />
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

/**
 * Custom delete button.
 */
export const DeleteButton: React.FC<BackButtonProps> = props => {
  return (
    <Pressable
      onPress={() => {
        props.onPress();
      }}>
      <Icon
        name="backspace"
        size={24}
        color={AppColors.green}
        // style={styles.number}
      />
    </Pressable>
  );
};
