import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
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
import {Button, Text} from 'react-native-ui-lib';
import {TextInput} from 'react-native-gesture-handler';

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
  const initInputSeedPhrase: string[] = [];
  const [inputSeedPhrase, setInputSeedPhrase] = useState(initInputSeedPhrase);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [nextWordInputPlaceHolder, setNextWordInputPlaceHolder] =
    useState('Next word(s)...');

  useImperativeHandle(ref, () => ({
    retry() {
      setInputSeedPhrase(initInputSeedPhrase);
    },
  }));

  const onPressNext = () => {
    if (nextWord.trim() !== '') {
      let newSeedPhrase: string[] = [];
      let phrase = '';
      for (let i = 0; i < inputSeedPhrase.length; i++) {
        phrase = phrase + ' ' + inputSeedPhrase[i].toLowerCase().trim();
        newSeedPhrase.push(inputSeedPhrase[i]);
      }
      if (nextWord.includes(' ')) {
        if (newSeedPhrase.length > 0) {
          newSeedPhrase = [];
        }
        const newWords = nextWord.split(' ', 24);
        for (let i = 0; i < newWords.length; i++) {
          newSeedPhrase.push(newWords[i]);
          phrase = phrase + ' ' + newWords[i].toLowerCase().trim();
        }
      } else {
        newSeedPhrase.push(nextWord);
        phrase = phrase + ' ' + nextWord.toLowerCase().trim();
      }

      setNextWord('');
      setInputSeedPhrase(newSeedPhrase);
      setSeedPhrase(phrase.trim());

      if (newSeedPhrase.length > 23) {
        setNextWordInputPlaceHolder('');
      } else if (newSeedPhrase.length > 22) {
        setNextWordInputPlaceHolder('Next word...');
      }
    }
  };

  /**
   * Confirm seed phrase button handler logic.
   */
  const confirmSeedPhraseBtnHandler = () => {
    if (inputSeedPhrase.length === 24) {
      props.onValidMnemonic(seedPhrase);
    } else {
      props.onInvalidMnemonic();
    }
  };

  const onClear = () => {
    setInputSeedPhrase(initInputSeedPhrase);
    setNextWord('');
    setSeedPhrase('');
    setNextWordInputPlaceHolder('Next word(s)...');
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

              <TextInput
                editable={false}
                multiline
                numberOfLines={4}
                value={seedPhrase}
                style={styles.textInput}
                placeholder={
                  'lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
                }
                placeholderTextColor={AppColors.gray}
              />
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  numberOfLines={1}
                  value={nextWord}
                  style={{
                    ...FONTS.body1,
                    width: wp('60%'),
                    color: AppColors.black,
                  }}
                  placeholder={nextWordInputPlaceHolder}
                  placeholderTextColor={AppColors.brown}
                  onChangeText={text => setNextWord(text)}
                  editable={inputSeedPhrase.length < 24}
                  autoFocus={true}
                  onEndEditing={e => {
                    onPressNext();
                  }}
                />
                <Button
                  style={styles.nextWordBtn}
                  outline={true}
                  outlineColor={AppColors.yellow}
                  label={'Next'}
                  size={'xSmall'}
                  disabled={inputSeedPhrase.length > 23}
                  labelStyle={{
                    ...FONTS.body4,
                  }}
                  onPress={() => {
                    onPressNext();
                  }}
                />
              </View>
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
                  onClear();
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
  nextWordBtn: {
    width: wp('20.0%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-end',
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
  nextWordButton: {
    width: wp('20%'),
  },
  textInput: {
    ...FONTS.body1,
    color: AppColors.black,
  },
});

export default SeedPhraseInputComponent;
