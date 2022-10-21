import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
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
import {useNavigation} from '@react-navigation/native';
import {headerWithDeleteButton} from '../navigation.stack';
import {constructSeedPhraseFromChipInputs} from '../utils';
import ErrorModalComponent from '../components/ErrorModalComponent';

/**
 * Contains the onboarding UI.
 */
const RestoreAccountScreen = () => {
  const navigation = useNavigation();

  // TODO: logic to fetch recovery phrase/pass it from navigation params
  const [seedPhrase, setSeedPhrase] = useState(
    'horse giraffe dog money book fire drink cup phone car jacket computer ' +
      'wire charger curtain router window plate floor key wine glass oak watch',
  );
  const initInputSeedPhrase: ChipsInputChipProps[] = [];
  const [inputSeedPhrase, setInputSeedPhrase] = useState(initInputSeedPhrase);
  const [errorDialogVisible, setErrorDialogVisibility] = useState(false);

  useEffect(() => {
    navigation.setOptions(
      headerWithDeleteButton(
        () => {
          // navigation back
          navigation.goBack();
        },
        () => {
          // clear entered seed phrase
          setInputSeedPhrase(initInputSeedPhrase);
        },
      ),
    );
  }, [navigation]);

  /**
   * Updates the chips after an new word has been entered or deleted.
   * @param newChips list of new chips.
   */
  const onChipsChangeHandler = (newChips: Incubator.ChipsInputChipProps[]) => {
    setInputSeedPhrase(newChips);
  };

  /**
   * Confirm seed phrase button handler logic.
   */
  const confirmSeedPhraseBtnHandler = () => {
    const seedPhraseStr = constructSeedPhraseFromChipInputs(inputSeedPhrase);
    if (seedPhrase == seedPhraseStr) {
      navigation.navigate('EnterUserName');
    } else {
      setErrorDialogVisibility(true);
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

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RestoreAccountScreen);

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
