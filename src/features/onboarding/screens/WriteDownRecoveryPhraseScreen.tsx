import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Switch, Text} from 'react-native-ui-lib';
import Screen from '../../../app_components/Screen';
import {FONTS} from '../../../ui_lib_configs/fonts';
import Clipboard from '@react-native-clipboard/clipboard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';

type Props = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'WriteDownRecoveryPhraseScreen'
>;

/**
 * Contains the onboarding UI.
 */
const WriteDownRecoveryPhraseScreen = ({route, navigation}: Props) => {
  const mnemonic = route?.params?.mnemonic;
  const [writtenDownSeedPhrase, setWrittenDownSeedPhrase] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Recovery Phrase',
      headerTransparent: true,
    });
    return () => {
      navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  const copySeedPhraseToClipBoard = () => {
    Clipboard.setString(mnemonic);
    ToastAndroid.showWithGravity(
      'Copied seed phrase.',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        {/* Tittle section */}
        <View>
          <Text color={AppColors.light_green} displayBold>
            Write down your recovery phrase.
          </Text>
          <Text color={AppColors.black} body2>
            Here is your recovery phrase. Write it down and store in safe place.
            Do not save it in your phone or your email.
          </Text>
        </View>
        {/* Body text group section. */}
        <View
          style={style.textGroup}
          onTouchEnd={() => {
            copySeedPhraseToClipBoard();
          }}>
          <TextInput
            editable={false}
            multiline
            numberOfLines={4}
            value={mnemonic}
            style={style.textInput}
            selectable={true}
          />
        </View>

        <View style={style.switchContainer}>
          <Switch
            disabled={false}
            onColor={AppColors.light_green}
            value={writtenDownSeedPhrase}
            onValueChange={() => {
              setWrittenDownSeedPhrase(!writtenDownSeedPhrase);
            }}
          />
          <Text
            style={[
              style.switchLabel,
              writtenDownSeedPhrase
                ? {color: AppColors.black}
                : {color: AppColors.brown},
            ]}>
            Yes, I have written down my phrase
          </Text>
        </View>

        {/* Button group section. */}
        <View style={style.buttonGroup}>
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.yellow}
            label={'Continue'}
            warning
            labelStyle={{
              ...FONTS.body1,
            }}
            size={'small'}
            onPress={() => {
              navigation.navigate('ConfirmRecoveryPhraseScreen', {
                mnemonic: mnemonic,
              });
            }}
            disabled={!writtenDownSeedPhrase}
          />
        </View>
      </View>
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
)(WriteDownRecoveryPhraseScreen);

const style = StyleSheet.create({
  container: {
    backgroundColor: AppColors.gray,
    maxHeight: hp('90.0%'),
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp('4.5%'),
    marginBottom: hp('4%'),
    paddingTop: hp('2%'),
  },
  button: {
    width: wp('30.0%'),
  },
  rootComponent: {
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-around',
  },
  textGroup: {
    justifyContent: 'space-around',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#ffff',
    borderRadius: wp('5%'),
  },
  switchLabel: {...FONTS.body5, marginLeft: wp('4%')},
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textInput: {
    ...FONTS.body1,
    color: AppColors.black,
  },
});
