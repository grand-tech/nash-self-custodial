import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Text} from 'react-native-ui-lib';
import Screen from '../../../app_components/Screen';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import {useFocusEffect} from '@react-navigation/native';

/**
 * Contains the onboarding UI.
 */
const TermsAndConditions = (props: Props) => {
  useFocusEffect(() => {
    props.navigation.setOptions({
      title: 'Terms & Conditions',
      headerShown: true,
      headerTransparent: true,
    });
    return () => {
      props.navigation.setOptions({
        title: '',
      });
    };
  });

  return (
    <Screen style={style.rootComponent}>
      <View style={style.container}>
        <ScrollView style={style.scrollView}>
          <Text color={AppColors.black} body3>
            In order to use our services, please read and accept our User
            Agreement and Terms by blicking the accept button below.{' '}
          </Text>

          {/* Body text group section. */}
          <View style={style.textGroup}>
            <Text color={AppColors.light_green} h2>
              Data and Privacy
            </Text>
            <Text color={AppColors.black} body3>
              By joining this network, you give us permission to collect
              anonymous information about your use of the app. Additionally, if
              you connect your phone number, a hashed copy of it will be stored
              on the Celo network. If you grant Nash access to your contact
              list, Nash will import each contact's name and phone number to
              allow users to connect through the Nash app. To learn how we
              collect and use this information please review our Privacy Policy.
            </Text>
          </View>

          <View style={style.textGroup}>
            <Text color={AppColors.light_green} h2>
              Celo and Nash Account
            </Text>
            <Text color={AppColors.black} body3>
              By joining this network, you give us permission to collect
              anonymous information about your use of the app. Additionally, if
              you connect your phone number, a hashed copy of it will be stored
              on the Celo network. If you grant Nash access to your contact
              list, Nash will import each contact's name and phone number to
              allow users to connect through the Nash app. To learn how we
              collect and use this information please review our Privacy Policy.
            </Text>
          </View>
        </ScrollView>

        {/* Button group section. */}
        <View style={style.buttonGroup}>
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.yellow}
            size={'small'}
            label={'Accept'}
            warning
            labelStyle={{
              ...FONTS.h4,
            }}
            onPress={() => {
              props.navigation.navigate('EnterUserName');
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

type NavigationProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'TermsAndConditions'
>;

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & NavigationProps;

export default connector(TermsAndConditions);

const style = StyleSheet.create({
  container: {
    backgroundColor: AppColors.gray,
    maxHeight: hp('95.0%'),
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp('4.5%'),
    paddingTop: hp('2%'),
  },
  button: {
    width: wp('60.0%'),
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
  scrollView: {maxHeight: hp('85%')},
});
