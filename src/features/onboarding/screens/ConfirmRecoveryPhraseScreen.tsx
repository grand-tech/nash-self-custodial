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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import {generateActionCompletedOnboarding} from '../redux_store/action.generators';
import ErrorModalComponent from '../../../app_components/ErrorModalComponent';

type NavigationProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'ConfirmRecoveryPhraseScreen'
>;

/**
 * Contains the onboarding UI.
 */
const ConfirmRecoveryPhraseScreen = (props: Props) => {
  const seedPhrase = props.route.params.mnemonic;

  const initInputSeedPhrase: ChipsInputChipProps[] = [];
  const [inputSeedPhrase, setInputSeedPhrase] = useState(initInputSeedPhrase);
  const [errorDialogVisible, setErrorDialogVisibility] = useState(false);

  useEffect(() => {
    props.navigation.setOptions(
      headerWithDeleteButton(
        () => {
          // navigation back
          props.navigation.goBack();
        },
        () => {
          // clear entered seed phrase
          setInputSeedPhrase(initInputSeedPhrase);
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Confirm seed phrase button handler logic.
   */
  const confirmSeedPhraseBtnHandler = () => {
    const seedPhraseStr = constructSeedPhraseFromChipInputs(inputSeedPhrase);
    if (seedPhrase === seedPhraseStr) {
      props.completeOnboarding();
    } else {
      setErrorDialogVisibility(true);
    }
  };

  /**
   * Validates updated chips before committing the changes to the component state.
   * @param newChips list of new chips after input.
   */
  const processInput = (newChips: ChipsInputChipProps[]) => {
    const validatedChips = validateSeedPhraseInput(
      initInputSeedPhrase,
      newChips,
    );

    if (validatedChips.length > 0) {
      setInputSeedPhrase(validatedChips);
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
                color={AppColors.light_green}
                displayBold
                style={[style.title]}>
                Confirm Recovery Phrase
              </Text>
              <Text
                center={true}
                color={AppColors.black}
                style={[style.counter]}
                body1>
                Please enter your recovery phrase
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
                onChange={newChips => processInput(newChips)}
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
                labelStyle={{
                  ...FONTS.h4,
                }}
                onPress={() => {
                  confirmSeedPhraseBtnHandler();
                }}
                onDismiss={() => setErrorDialogVisibility(false)}
                disabled={inputSeedPhrase.length !== 24}
              />
            </View>
            <ErrorModalComponent
              onRetry={() => {
                setInputSeedPhrase(initInputSeedPhrase);
                setErrorDialogVisibility(false);
              }}
              visible={errorDialogVisible}
              errorMessage={'Invalid seed phrase!!'}
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
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {
  completeOnboarding: generateActionCompletedOnboarding,
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
    width: wp('80.0%'),
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
