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
export const CreateAccountScreen = () => {
  const navigation = useNavigation();

  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        {/* Tittle section */}
        <View>
          <Text color={AppColors.green} h1>
            Prepare to write down your recovery phrase.
          </Text>
        </View>

        {/* Body text group section. */}
        <View style={style.textGroup}>
          <Text color={AppColors.black} body1>
            If your device gets lost or stolen, you can restore your wallet
            using your recovery phrase.
          </Text>
          <Text color={AppColors.green} body1>
            Get pen and paper before you start.
          </Text>
        </View>

        {/* Button group section. */}
        <View style={style.buttonGroup}>
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.light_green}
            label={'Create Account'}
            secondary
            labelStyle={{
              ...FONTS.h4,
            }}
            onPress={() => {
              navigation.navigate('TermsAndConditions');
            }}
          />
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.yellow}
            label={'Restore Account'}
            warning
            size={'large'}
            labelStyle={{
              ...FONTS.h4,
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
)(CreateAccountScreen);

const style = StyleSheet.create({
  container: {
    backgroundColor: AppColors.gray,
    maxHeight: hp('73.0%'),
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp('4.5%'),
    marginBottom: hp('4%'),
  },
  button: {
    width: wp('80.0%'),
  },
  rootComponent: {
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 0.17,
    justifyContent: 'space-between',
  },
});
