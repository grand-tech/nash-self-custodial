import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Screen from '../../../app_components/Screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {FONTS} from '../../../ui_lib_configs/fonts';
import {AppColors} from '../../../ui_lib_configs/colors';

import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import EnterPinModal from '../../../app_components/EnterPinModal';
import {NashCache} from '../../../utils/cache';
import {OnboardingStatusNames} from '../redux_store/reducers';
import {generateActionSetLoading} from '../../ui_state_manager/action.generators';
import LoadingModalComponent from '../../../app_components/LoadingModalComponent';
import {createNewAccountAction} from '../redux_store/action.generators';

const CreatePinScreen: React.FC<Props> = (props: Props) => {
  const [newPin, setNewPin] = useState('');
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
  const onCreateNewPin = (pin: string) => {
    setNewPin(pin);
  };

  // What to do when first PIN matches second PIN.
  const onConfirmNewPin = (pin: string) => {
    NashCache.setPinCache(pin);
    if (
      props.onboarding_status.name ===
      OnboardingStatusNames.choose_restore_account
    ) {
      // restore account.
      props.navigation.navigate('RestoreAccount', {pin: pin});
    } else {
      // create new account.
      props.dispatchActionSetLoading(
        'Creating account...',
        '',
        'on pin matched',
      );
    }

    // Reset the new pin incase the user navigates back.
    setNewPin('');
  };

  // What to do when loading modal has opened.
  const onShowModal = () => {
    if (isFocused) {
      props.dispatchActionCreateNewAccount(newPin);
    }
  };

  return (
    <Screen style={styles.screen}>
      <EnterPinModal
        target="privateKey"
        onPinMatched={onCreateNewPin}
        visible={isFocused}
        creatingPin={true}
      />

      <EnterPinModal
        target="privateKey"
        onPinMatched={onConfirmNewPin}
        visible={newPin !== '' && isFocused}
        confirmingNewPin={true}
        validatorPin={newPin}
      />

      <LoadingModalComponent
        TAG="ConfirmPinScreen"
        visible={props.ui_screen_status === 'loading' && isFocused}
        onShowModal={onShowModal}
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
  dispatchActionCreateNewAccount: createNewAccountAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & StackProps;

export default connector(CreatePinScreen);

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
