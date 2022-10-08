import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';

/**
 * Contains the onboarding UI.
 */
export const TermsAndConditions = () => {
  const navigation = useNavigation();
  const [seedPhrase, setSeedPhrase] = useState(
    'Horse  giraffe  dog money  book  fire  drink cup  phone  car  jacket computer  wire  charger curtain  router  window  plate  floor  key  wine glass  oak  watch',
  );
  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        {/* Tittle section */}
        <View>
          <Text color={AppColors.light_green} displayBold>
            Write down recovery phrase
          </Text>
          <Text color={AppColors.black} body3>
            Here is your recovery phrase. Write it down and store in safe place.
            Do not save it in your phone or your email.
          </Text>
        </View>

        {/* Body text group section. */}
        <View style={style.textGroup}>
          <TextInput
            editable={false}
            multiline
            numberOfLines={4}
            value={seedPhrase}
            color={AppColors.green}
          />
        </View>

        <Switch onColor={AppColors.light_green}></Switch>
        {/* Button group section. */}
        <View style={style.buttonGroup}>
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.light_green}
            label={'Accept'}
            secondary
            labelStyle={{
              ...FONTS.h4,
            }}
            onPress={() => {
              navigation.navigate('EnterUserName');
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

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions);

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
    width: wp('80.0%'),
  },
  rootComponent: {
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-around',
  },
  textGroup: {
    flex: 0.4,
    justifyContent: 'space-around',
    paddingTop: hp('4%'),
  },
});
