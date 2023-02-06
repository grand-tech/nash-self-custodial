import React from 'react';
import {StyleSheet, View} from 'react-native';
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
import {
  chooseCreateNewAccount,
  chooseRestoreExistingAccount,
} from '../redux_store/action.generators';
import analytics from '@react-native-firebase/analytics';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingNavigationStackParamsList} from '../navigation/navigation.params.type';
import {useFocusEffect} from '@react-navigation/native';

/**
 * Contains the onboarding UI.
 */
const CreateAccountScreen = (props: Props) => {
  useFocusEffect(() => {
    props.navigation.setOptions({
      title: '',
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
        {/* Tittle section */}
        <View>
          <Text color={AppColors.light_green} h1 style={style.title}>
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
            size={'small'}
            secondary
            labelStyle={{
              ...FONTS.body1,
            }}
            onPress={async () => {
              props.dispatchCreateAccount();
              props.navigation.navigate('TermsAndConditions');
              await analytics().logEvent('coming_soon', {
                feature: '[onboarding] select create account',
                timestamp: new Date().getMilliseconds(),
              });
            }}
          />
          <Button
            style={style.button}
            outline={true}
            outlineColor={AppColors.yellow}
            label={'Restore Account'}
            warning
            size={'small'}
            labelStyle={{
              ...FONTS.body1,
            }}
            onPress={async () => {
              props.dispatchRestoreAccount();
              props.navigation.navigate('TermsAndConditions');
              await analytics().logEvent('coming_soon', {
                feature: '[onboarding] select restore account',
                timestamp: new Date().getMilliseconds(),
              });
            }}
          />
        </View>
      </View>
    </Screen>
  );
};

type StackProps = NativeStackScreenProps<
  OnboardingNavigationStackParamsList,
  'SelectCreateOrRestoreAccount'
>;

const mapStateToProps = (state: RootState) => ({
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {
  dispatchRestoreAccount: chooseRestoreExistingAccount,
  dispatchCreateAccount: chooseCreateNewAccount,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & StackProps;

export default connector(CreateAccountScreen);

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
    width: wp('60.0%'),
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
  title: {
    fontWeight: '900',
  },
});
