import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Text} from 'react-native-ui-lib';
import Screen from '../../../app_components/Screen';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {useNavigation} from '@react-navigation/native';

/**
 * Contains the onboarding UI.
 */
export const SetUpRecoveryPhrase: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        {/* Tittle section */}

        <Text color={AppColors.light_green} h1 style={style.title}>
          Set up your recovery phrase
        </Text>

        {/* Body text group section. */}
        <View>
          <Text color={AppColors.black} body1 style={{marginVertical: 10}}>
            Your Recovery phrase is the most important part of your account.
          </Text>
          <Text color={AppColors.green} body1 style={{marginVertical: 10}}>
            Please find a private place to set up your Phrase. It takes about
            five minutes.
          </Text>
        </View>

        {/* Button group section. */}
        <View style={style.buttonGroup}>
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.yellow}
            label={'Set up'}
            warning
            labelStyle={{
              ...FONTS.h4,
            }}
            onPress={() => {
              navigation.navigate('SetUpSeedPhraseInstructions');
            }}
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
)(SetUpRecoveryPhrase);

const style = StyleSheet.create({
  container: {
    backgroundColor: AppColors.gray,
    maxHeight: hp('50.0%'),
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp('4.5%'),
  },
  button: {
    width: wp('80.0%'),
  },
  rootComponent: {
    justifyContent: 'space-around',
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 0.17,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '900',
  },
});
