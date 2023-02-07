import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Screen from '../../../app_components/Screen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import SeedPhraseInputComponent, {
  ErrorModalRetry,
} from '../../../app_components/SeedPhraseInputComponent';
import ErrorModalComponent from '../../../app_components/ErrorModalComponent';
import {
  generateActionSetError,
  generateActionSetNormal,
} from '../../ui_state_manager/action.generators';
import {useIsFocused} from '@react-navigation/native';

type NavigationProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'ConfirmRecoveryPhraseScreen'
>;

/**
 * Contains the onboarding UI.
 */
const ConfirmRecoveryPhraseScreen = (props: Props) => {
  const isFocused = useIsFocused();
  const seedPhrase = props.route.params.mnemonic;
  const seedPhraseInputRef = useRef<ErrorModalRetry>(null);

  useEffect(() => {
    props.navigation.setOptions({
      title: 'Confirm Recovery Phrase',
      headerTransparent: true,
    });
  }, []);

  /**
   * Confirm seed phrase button handler logic.
   */
  const confirmSeedPhraseBtnHandler = (mnemonic: string) => {
    if (seedPhrase === mnemonic) {
      props.navigation.navigate('EnterFiatPaymentInformationScreen');
    } else {
      props.dispatchSetError('', 'Seed phrase did not match!!');
    }
  };

  return (
    <Screen>
      <SeedPhraseInputComponent
        onValidMnemonic={confirmSeedPhraseBtnHandler}
        onInvalidMnemonic={() => {
          props.dispatchSetError('', 'Invalid seed phrase!!');
        }}
        isFocused={false}
        ref={seedPhraseInputRef}
        instructions="Please enter your recovery phrase."
      />

      <ErrorModalComponent
        onRetry={() => {
          seedPhraseInputRef.current?.retry();
          props.dispatchSetNormal();
        }}
        visible={props.ui_status === 'error' && isFocused}
      />
    </Screen>
  );
};

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  onboarding_status: state.onboarding.status,
  ui_status: state.ui_state.status,
});

const mapDispatchToProps = {
  dispatchSetError: generateActionSetError,
  dispatchSetNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ReduxProps & NavigationProps;
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ConfirmRecoveryPhraseScreen);

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  button: {
    width: wp('30.0%'),
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-between',
  },
  textGroup: {
    justifyContent: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#ffff',
    borderRadius: wp('5%'),
    minWidth: wp('80%'),
  },
  counter: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
  chipInputGroup: {
    justifyContent: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#ffff',
    borderRadius: wp('5%'),
    minWidth: wp('80%'),
  },
});
