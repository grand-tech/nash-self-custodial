/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';

import Screen from '../../../app_components/Screen';
import {generateActionRestoreExistingAccount} from '../redux_store/action.generators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import {
  generateActionSetLoading,
  generateActionSetError,
  generateActionSetNormal,
} from '../../ui_state_manager/action.generators';
import ErrorModalComponent from '../../../app_components/ErrorModalComponent';
import LoadingModalComponent from '../../../app_components/LoadingModalComponent';
import {useIsFocused} from '@react-navigation/native';
import SeedPhraseInputComponent, {
  ErrorModalRetry,
} from '../../../app_components/SeedPhraseInputComponent';

/**
 * Navigation props. TODO move to centralized file.
 */
type NavigationProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'RestoreAccount'
>;

/**
 * Contains the onboarding UI.
 */
const RestoreAccountScreen = (props: Props) => {
  const isFocused = useIsFocused();
  const [seedPhrase, setSeedPhrase] = useState('');
  const seedPhraseInputRef = useRef<ErrorModalRetry>(null);

  useEffect(() => {
    props.navigation.setOptions({
      title: 'Restore Account',
      headerTransparent: true,
    });
  }, []);

  const onInvalidMnemonic = () => {
    props.dispatchSetError('', 'Invalid mnemonic!!');
  };

  const onValidMnemonic = (_mnemonic: string) => {
    setSeedPhrase(_mnemonic);
    props.dispatchSetLoading('Restoring account ...', '');
  };

  const onShowModal = () => {
    if (isFocused) {
      props.dispatchRestoreAccount(props.route.params.pin, seedPhrase);
    }
  };

  return (
    <Screen style={styles.screen}>
      <SeedPhraseInputComponent
        onValidMnemonic={onValidMnemonic}
        onInvalidMnemonic={onInvalidMnemonic}
        isFocused={false}
        ref={seedPhraseInputRef}
        instructions="To restore your account, enter your 24-word recovery (seed)
        phrase."
      />

      <LoadingModalComponent
        TAG="RestoreAccountScreen"
        onShowModal={onShowModal}
        visible={props.ui_status === 'loading' && isFocused}
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
  dispatchRestoreAccount: generateActionRestoreExistingAccount,
  dispatchSetLoading: generateActionSetLoading,
  dispatchSetNormal: generateActionSetNormal,
  dispatchSetError: generateActionSetError,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ReduxProps & NavigationProps;
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(RestoreAccountScreen);

const styles = StyleSheet.create({
  screen: {},
});
