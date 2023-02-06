import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../../app_components/Screen';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {AppColors} from '../../../ui_lib_configs/colors';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Button, Text, TextField} from 'react-native-ui-lib';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {generateActionCompletedOnboarding} from '../../onboarding/redux_store/action.generators';
import {OnboardingStatusNames} from '../../onboarding/redux_store/reducers';
import {generateRampActionUpdateFiatPaymentMethods} from '../redux_store/action.generators';

const EnterPaymentInformationScreen: React.FC<Props> = (props: Props) => {
  const navigation = useNavigation();

  const [name, setName] = useState(props.userName);
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber);

  const submit = () => {
    props.updatePaymentMethod(name, phoneNumber);

    if (
      props.onboarding_status.name === OnboardingStatusNames.onboarding_complete
    ) {
      navigation.goBack();
    } else {
      props.completeOnboarding();
    }
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({headerShown: false});
    navigation.setOptions({
      title: 'Fiat Payment Information',
      headerTransparent: true,
    });

    return () => {
      navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  return (
    <Screen style={style.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{alignItems: 'center'}}>
            <Text color={AppColors.light_green} body1>
              Enter Your M-Pesa Details:
            </Text>

            {/* Body text group section. */}
            <View style={style.textGroup}>
              <TextField
                body4
                color={AppColors.black}
                containerStyle={{marginBottom: hp('1.00%')}}
                floatingPlaceholder
                placeholder="Enter Full Name"
                maxLength={200}
                editable={true}
                minLength={4}
                disabledColor={AppColors.brown}
                style={style.textInput}
                migrate
                onChangeText={(text: string) => {
                  setName(text);
                }}
                value={name}
              />
            </View>
            <View style={style.textGroup}>
              <TextField
                body4
                color={AppColors.black}
                containerStyle={{marginBottom: hp('1.00%')}}
                floatingPlaceholder
                placeholder="M-Pesa Phone Number"
                maxLength={13}
                minLength={10}
                editable={true}
                disabledColor={AppColors.brown}
                style={style.textInput}
                migrate
                onChangeText={(text: string) => {
                  setPhoneNumber(text);
                }}
                value={phoneNumber}
              />
            </View>

            <Button
              style={style.button}
              outline={true}
              outlineColor={AppColors.light_green}
              label={'Save'}
              labelStyle={{
                ...FONTS.body1,
              }}
              disabled={name.length < 2 || phoneNumber.length < 10}
              onPress={() => {
                submit();
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-between',
    height: hp('60%'),
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: hp('9%'),
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    marginTop: hp('15%'),
  },
  privateKeyView: {
    backgroundColor: '#ffff',
    width: wp('90%'),
    alignContent: 'center',
    padding: wp('3%'),
    flexDirection: 'row',
    borderRadius: wp('2%'),
    maxWidth: wp('80%'),
  },
  privateKey: {
    textAlign: 'center',
    maxWidth: wp('65%'),
    color: AppColors.green,
  },
  copyIcon: {
    paddingRight: wp('3%'),
    paddingLeft: wp('1%'),
  },
  textInputStyle: {
    ...FONTS.body1,
    textAlign: 'center',
    color: AppColors.green,
  },
  button: {
    width: wp('50.0%'),
    marginTop: hp('10%'),
  },
  textGroup: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 10,
    marginVertical: hp('2%'),
  },
  textInput: {
    width: wp('70%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  userName: state.ramp_fiat_payment_methods.payment_methods.name,
  phoneNumber: state.ramp_fiat_payment_methods.payment_methods.phoneNumber,
  onboarding_status: state.onboarding.status,
});

const mapDispatchToProps = {
  updatePaymentMethod: generateRampActionUpdateFiatPaymentMethods,
  completeOnboarding: generateActionCompletedOnboarding,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface Props extends ReduxProps {}

export default connector(EnterPaymentInformationScreen);
