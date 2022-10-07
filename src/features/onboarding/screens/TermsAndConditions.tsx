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
export const TermsAndConditions = () => {
  const navigation = useNavigation();

  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        {/* Tittle section */}
        <View>
          <Text color={AppColors.light_green} displayBold>
            Terms &amp; Conditions
          </Text>
          <Text color={AppColors.black} body3>
            In order to use our services, please read and accept our User
            Agreement and Terms by blicking the accept button below.{' '}
          </Text>
        </View>

        {/* Body text group section. */}
        <View style={style.textGroup}>
          <Text color={AppColors.light_green} h2>
            Data and Privacy
          </Text>
          <Text color={AppColors.black} body3>
            By joining this network, you give us permission to collect anonymous
            information about your use of the app. Additionally, if you connect
            your phone number, a hashed copy of it will be stored on the Celo
            network. If you grant Nash access to your contact list, Nash will
            import each contact's name and phone number to allow users to
            connect through the Nash app. To learn how we collect and use this
            information please review our Privacy Policy.
          </Text>
        </View>

        <View style={style.textGroup}>
          <Text color={AppColors.light_green} h2>
            Celo Dollar and Nash Account
          </Text>
          <Text color={AppColors.black} body3>
            By joining this network, you give us permission to collect anonymous
            information about your use of the app. Additionally, if you connect
            your phone number, a hashed copy of it will be stored on the Celo
            network. If you grant Nash access to your contact list, Nash will
            import each contact's name and phone number to allow users to
            connect through the Nash app. To learn how we collect and use this
            information please review our Privacy Policy.
          </Text>
        </View>

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
