import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Screen} from 'react-native-screens';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../app-redux-store/store';
import EnterPinModal from '../../app_components/EnterPinModal';
import LoadingModalComponent from '../../app_components/LoadingModalComponent';
import SuccessModalComponent from '../../app_components/SuccessModalComponent';
import {AppColors} from '../../ui_lib_configs/colors';
import {FONTS} from '../../ui_lib_configs/fonts';
import {OnboardingNavigationStackParamsList} from '../onboarding/navigation/navigation.params.type';
import {generateActionSetLoading} from '../ui_state_manager/action.generators';
import {generateActionChangePIN} from './redux_store/action.generators';

const ChangePinScreen: React.FC<Props> = (props: Props) => {
  const [newPIN, setNewPin] = useState('');
  const [oldPIN, setOldPin] = useState('');
  const isFocused = useIsFocused();

  // May be useless. But lets have it for now.
  useFocusEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      title: 'Create Your PIN Number',
    });
  });

  // What to do when the user enters their pin for the first time.
  const onOldPinMatched = (pin: string) => {
    setOldPin(pin);
  };

  // What to do when the user enters their pin for the first time.
  const onCreateNewPin = (pin: string) => {
    setNewPin(pin);
  };

  // What to do when first PIN matches second PIN.
  const onConfirmNewPin = (pin: string) => {
    // create new account.
    props.dispatchActionSetLoading(
      'Updating PIN number ...',
      '',
      'on pin matched',
    );
  };

  // What to do when loading modal has opened.
  const onShowModal = () => {
    if (isFocused) {
      props.dispatchActionChangePIN(oldPIN, newPIN);
    }
  };

  return (
    <Screen style={styles.screen}>
      <EnterPinModal
        target="privateKey"
        onPinMatched={onOldPinMatched}
        visible={isFocused && oldPIN === ''}
        changePin={true}
      />

      <EnterPinModal
        target="privateKey"
        onPinMatched={onCreateNewPin}
        visible={isFocused && oldPIN !== '' && newPIN === ''}
        creatingPin={true}
      />

      <EnterPinModal
        target="privateKey"
        onPinMatched={onConfirmNewPin}
        visible={newPIN !== '' && isFocused}
        confirmingNewPin={true}
        validatorPin={newPIN}
      />

      <LoadingModalComponent
        TAG="ConfirmPinScreen"
        visible={props.ui_screen_status === 'loading' && isFocused}
        onShowModal={onShowModal}
      />

      <SuccessModalComponent
        visible={props.ui_screen_status === 'success' && isFocused}
        onPressOkay={() => {
          props.navigation.goBack();
        }}
      />
    </Screen>
  );
};

type StackProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'SelectCreateOrRestoreAccount'
>;

const mapStateToProps = (state: RootState) => ({
  onboarding_status: state.onboarding.status,
  ui_screen_status: state.ui_state.status,
});

const mapDispatchToProps = {
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchActionChangePIN: generateActionChangePIN,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & StackProps;

export default connector(ChangePinScreen);

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
    color: AppColors.perfumeHaze,
  },
  showPin: {
    ...FONTS.body3,
    alignSelf: 'center',
  },
  pinDisplayArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
