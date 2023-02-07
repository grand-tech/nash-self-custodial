import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../ui_lib_configs/colors';
import {FONTS} from '../ui_lib_configs/fonts';
import {
  Button,
  ChipsInputChipProps,
  Incubator,
  Text,
} from 'react-native-ui-lib';
import {
  constructSeedPhraseFromChipInputs,
  validateSeedPhraseInput,
} from '../utils/seed.phrase.validation.utils';

/**
 * Screen component properties.
 * @typedef {Object} PinKeyPadProps properties expected by the PinKeyPad component.
 * @property { any} onChange the components to be rendered on the constructed screen.
 * @property { any } onDelete
 */
export interface SeedPhraseInputComponentProps {
  onValidMnemonic: any;
  onInvalidMnemonic: any;
  isFocused: boolean;
  instructions: string;
}

export interface ErrorModalRetry {
  retry(): void;
}

/**
 * Custom number key pad component.
 * @param props component props.
 * @returns
 */
const SeedPhraseInputComponent = forwardRef<
  ErrorModalRetry,
  SeedPhraseInputComponentProps
>((props, ref) => {
  const initInputSeedPhrase: ChipsInputChipProps[] = [];
  const [inputSeedPhrase, setInputSeedPhrase] = useState(initInputSeedPhrase);

  useImperativeHandle(ref, () => ({
    retry() {
      setInputSeedPhrase(initInputSeedPhrase);
    },
  }));

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
  const confirmSeedPhraseBtnHandler = () => {
    if (inputSeedPhrase.length === 24) {
      const seedPhraseStr = constructSeedPhraseFromChipInputs(inputSeedPhrase);
      props.onValidMnemonic(seedPhraseStr);
    } else {
      props.onInvalidMnemonic();
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text
              center={true}
              color={AppColors.black}
              style={[styles.counter]}
              body1>
              {props.instructions}
            </Text>

            {/* Body text group section. */}
            <View style={styles.chipInputGroup}>
              <Text color={AppColors.yellow} style={styles.counter} body1>
                Word {inputSeedPhrase.length} of 24
              </Text>
              <Incubator.ChipsInput
                placeholder="Next word..."
                floatingPlaceholder={inputSeedPhrase.length < 24}
                floatingPlaceholderStyle={{
                  ...FONTS.body1,
                  color: AppColors.brown,
                }}
                chips={inputSeedPhrase}
                defaultChipProps={{
                  labelStyle: {...FONTS.body2},
                }}
                onChange={newChips => onChipsChangeHandler(newChips)}
                maxChips={24}
                autoFocus={true}
                autoCapitalize={'none'}
              />
            </View>

            {/* Button group section. */}
            <View style={styles.buttonGroup}>
              <Button
                style={styles.button}
                outline={true}
                outlineColor={AppColors.yellow}
                label={'Clear'}
                size={'small'}
                disabled={inputSeedPhrase.length === 0}
                labelStyle={{
                  ...FONTS.body1,
                }}
                onPress={() => {
                  setInputSeedPhrase(initInputSeedPhrase);
                }}
              />
              <Button
                style={styles.button}
                outline={true}
                outlineColor={AppColors.light_green}
                label={'Confirm'}
                size={'small'}
                disabled={inputSeedPhrase.length < 24}
                labelStyle={{
                  ...FONTS.body1,
                }}
                onPress={() => {
                  confirmSeedPhraseBtnHandler();
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    paddingVertical: wp('5%'),
    paddingHorizontal: wp('5%'),
  },
  button: {
    width: wp('30.0%'),
    marginBottom: hp('1%'),
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

export default SeedPhraseInputComponent;
