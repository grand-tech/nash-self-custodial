/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Button,
  ChipsInputChipProps,
  Incubator,
  Text,
} from 'react-native-ui-lib';
import Screen from '../../../app_components/Screen';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {headerWithDeleteButton} from '../navigation/navigation.stack';
import {
  constructSeedPhraseFromChipInputs,
  validateSeedPhraseInput,
} from '../../../utils/seed.phrase.validation.utils';
import {generateActionRestoreExistingAccount} from '../redux_store/action.generators';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import {
  generateActionSetLoading,
  generateActionSetError,
} from '../../ui_state_manager/action.generators';
import ErrorModalComponent from '../../../app_components/ErrorModalComponent';
import LoadingModalComponent from '../../../app_components/LoadingModalComponent';
import {useIsFocused} from '@react-navigation/native';

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
  const initInputSeedPhrase: ChipsInputChipProps[] = [];
  const [inputSeedPhrase, setInputSeedPhrase] = useState(initInputSeedPhrase);
  const [errorDialogVisible, setErrorDialogVisibility] = useState(false);

  useEffect(() => {
    props.navigation.setOptions(
      headerWithDeleteButton(
        () => {
          // props.navigation back
          props.navigation.goBack();
        },
        () => {
          // clear entered seed phrase
          setInputSeedPhrase(initInputSeedPhrase);
        },
      ),
    );
  }, []);

  /**
   * Updates the chips after an new word has been entered or deleted.
   * @param newChips list of new chips.
   */
  const onChipsChangeHandler = (newChips: Incubator.ChipsInputChipProps[]) => {
    const validatedChips = validateSeedPhraseInput(
      initInputSeedPhrase,
      newChips,
    );

    if (validatedChips.length > 0) {
      setInputSeedPhrase(validatedChips);
    }
  };

  /**
   * Confirm seed phrase button handler logic.
   */
  const confirmSeedPhraseBtnHandler = async () => {
    if (inputSeedPhrase.length === 24) {
      props.dispatchSetLoading('Restoring account ...', '');
    } else {
      props.dispatchSetError('Invalid mnemonic', '');
    }
  };

  const onShowModal = () => {
    if (isFocused) {
      const seedPhraseStr = constructSeedPhraseFromChipInputs(inputSeedPhrase);
      props.dispatchRestoreAccount(props.route.params.pin, seedPhraseStr);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.container}>
            {/* Tittle section */}
            <View>
              <Text
                style={[style.title]}
                color={AppColors.light_green}
                displayBold>
                Restore Your Account
              </Text>
              <Text
                center={true}
                color={AppColors.black}
                style={[style.counter]}
                body1>
                To restore your account, enter your 24-word recovery (seed)
                phrase.
              </Text>
            </View>
            {/* Body text group section. */}
            <View style={style.chipInputGroup}>
              <Text color={AppColors.yellow} style={style.counter} body1>
                Word {inputSeedPhrase.length} of 24
              </Text>
              <Incubator.ChipsInput
                placeholder="Next word..."
                floatingPlaceholder={inputSeedPhrase.length < 24}
                floatingPlaceholderStyle={{
                  ...FONTS.body3,
                  color: AppColors.brown,
                }}
                chips={inputSeedPhrase}
                defaultChipProps={{
                  labelStyle: {...FONTS.body1},
                }}
                onChange={newChips => onChipsChangeHandler(newChips)}
                maxChips={24}
                autoFocus={true}
                autoCapitalize={'none'}
              />
            </View>

            {/* Button group section. */}
            <View style={style.buttonGroup}>
              <Button
                style={style.button}
                outline={true}
                outlineColor={AppColors.light_green}
                label={'Confirm'}
                secondary
                enabled={initInputSeedPhrase.length === 24}
                labelStyle={{
                  ...FONTS.h4,
                }}
                onPress={() => {
                  confirmSeedPhraseBtnHandler();
                }}
              />
            </View>

            <ErrorModalComponent
              onRetry={() => {
                setInputSeedPhrase(initInputSeedPhrase);
                setErrorDialogVisibility(false);
              }}
              visible={errorDialogVisible && isFocused}
            />

            <LoadingModalComponent
              TAG="ReastoreAccountScreen"
              onShowModal={onShowModal}
              visible={props.ui_status === 'loading' && isFocused}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  dispatchSetError: generateActionSetError,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ReduxProps & NavigationProps;
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(RestoreAccountScreen);

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  button: {
    width: wp('80.0%'),
    marginBottom: hp('1%'),
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-between',
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
  counter: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
