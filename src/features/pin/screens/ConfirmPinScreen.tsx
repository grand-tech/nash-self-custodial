import React, {useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Screen from '../../../app_components/Screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PinKeyPad from '../components/PinKeyPad';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {AppColors} from '../../../ui_lib_configs/colors';

import {Chip} from 'react-native-ui-lib';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {OnboardingStatusNames} from '../../onboarding/redux_store/reducers';
import {createNewAccountAction} from '../../onboarding/redux_store/action.generators';
import {
  generateActionSetLoading,
  generateActionSetNormal,
} from '../../ui_state_manager/action.generators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../../onboarding/navigation/navigation.params.type';
import {addPinChar, deletePinChar} from '../utils';
import {NashCache} from '../../../utils/cache';
import LoadingModalComponent from '../../../app_components/LoadingModalComponent';
import {useIsFocused} from '@react-navigation/native';

const ConfirmPinScreen: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const pin: string = props.route.params.pin;

  const [pinError, setPinError] = React.useState('');

  const [pinCharArray, setPinTextArray] = useState(['', '', '', '', '', '']);
  const [hidePin, setHidePin] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * What happens when the pin numbers match.
   */
  const onPinMatched = async () => {
    if (
      props.onboarding_status === OnboardingStatusNames.choose_restore_account
    ) {
      NashCache.setPinCache(pin);
      props.navigation.navigate('RestoreAccount', {pin: pin});
    } else {
      props.dispatchActionSetLoading('Creating account', '');
    }
  };

  const onShowModal = () => {
    if (isFocused) {
      props.dispatchActionCreateNewAccount(pin);
    }
  };

  const onDelete = () => {
    const updates = deletePinChar(currentIndex, pinCharArray);
    setCurrentIndex(updates.currentIndex);
    setPinTextArray(updates.pinArray);
  };

  const onChange = (pinChar: string) => {
    setPinError('');

    const updates = addPinChar(pinChar, currentIndex, pinCharArray);

    setPinTextArray(updates.pinArray);
    setCurrentIndex(updates.currentIndex);

    if (currentIndex === pinCharArray.length - 1) {
      let p = updates.pinArray.toString().replaceAll(',', '');
      if (p === pin) {
        onPinMatched();
      } else {
        setPinError('PIN did not match!!!');
        setCurrentIndex(0);
        setPinTextArray(['', '', '', '', '', '']);
      }
    }
  };

  useLayoutEffect(() => {
    const headerConfigs = {
      title: '',
    };
    props.navigation.setOptions(headerConfigs);
  }, [props.navigation]);

  return (
    <Screen style={styles.screen}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.enterPin}>
          <Text style={styles.pinText}>Confirm PIN</Text>
        </View>

        <View style={{alignSelf: 'center'}}>
          <Text style={styles.pinError}>{pinError}</Text>
        </View>

        <View style={styles.pinIcons}>
          {pinCharArray.map((text, index) => (
            <View key={index} style={styles.pinContainer}>
              {text == '' ? (
                <Text style={styles.starText} />
              ) : (
                <Text style={styles.starText}>{hidePin ? '*' : text}</Text>
              )}
            </View>
          ))}
        </View>

        {hidePin ? (
          <Chip
            label={'Show Pin'}
            onPress={() => {
              setHidePin(!hidePin);
            }}
          />
        ) : (
          <Chip
            label={'Hide Pin'}
            onPress={() => {
              setHidePin(!hidePin);
            }}
          />
          // <Text style={styles.showPin}>Hide Pin</Text>
        )}
      </View>

      <View style={styles.keyPad}>
        {/* onChange={handleChange} onDelete={onDelete} */}
        <PinKeyPad onChange={onChange} onDelete={onDelete} />
      </View>

      <LoadingModalComponent
        visible={props.ui_screen_status === 'loading'}
        onShowModal={onShowModal}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  navIcon: {
    marginTop: hp('5%'),
    marginLeft: wp('5%'),
  },
  enterPin: {
    marginTop: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    ...FONTS.displayBold,
    color: AppColors.light_green,
  },
  pinIcons: {
    marginVertical: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  keyPad: {
    marginHorizontal: wp('10%'),
  },
  pinContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('10.667%'),
    height: wp('10.667%'),
    backgroundColor: AppColors.perfumeHaze,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.667%'),
    marginHorizontal: hp('0.5%'),
  },
  starText: {
    ...FONTS.h3,
    color: AppColors.green,
    alignSelf: 'center',
  },
  pinError: {
    ...FONTS.body7,
    color: AppColors.red,
  },
  showPin: {
    ...FONTS.body1,
    alignSelf: 'center',
  },
});

/**
 * Contains list of expected state props to monitor.
 * @typedef { object } ConfirmPinScreenProps
 * @property { OnboardingStatusNames } onboarding_status onboarding status.
 * @property { string } ui_screen_status the status of the screen
 */
interface StateProps {
  onboarding_status: OnboardingStatusNames;
  ui_screen_status: string;
}

const mapStateToProps = (state: RootState) => ({
  onboarding_status: state.onboarding.status.name,
  ui_screen_status: state.ui_state.status,
});

/**
 * Contains list of expected state props to monitor.
 * @typedef { object } ConfirmPinScreenProps
 * @property { OnboardingStatusNames } onboarding_status onboarding status.
 * @property { string } ui_screen_status the status of the screen
 */
interface DispatchProps {
  dispatchActionSetLoading: typeof generateActionSetLoading;
  dispatchActionCreateNewAccount: typeof createNewAccountAction;
  dispatchActionSetNormal: typeof generateActionSetNormal;
}

const mapDispatchToProps = {
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchActionCreateNewAccount: createNewAccountAction,
  dispatchActionSetNormal: generateActionSetNormal,
};

type StackProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'ConfirmPin'
>;
type Props = DispatchProps & StateProps & StackProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPinScreen);
