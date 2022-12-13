import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Text, TextField} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';
import Screen from '../../../app_components/Screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {generateRampActionUpdateFiatPaymentMethods} from '../../ramp_payment_information/redux_store/action.generators';
import {generateActionCompletedOnboarding} from '../../onboarding/redux_store/action.generators';
import {selectOnboardingStatus} from '../../onboarding/redux_store/selectors';
import {OnboardingStatusNames} from '../../onboarding/redux_store/reducers';

/**
 * Create account screen props.
 * @typedef {Object} CreateAccountScreenProps properties expected by the create account component.
 * @property { string} onboarding_status the components to be rendered on the constructed screen.
 */

/**
 * Contains the screen to enter user name.
 */
const EnterMpesaPaymentInfoScreen = (props: Props) => {
  const navigation = useNavigation();
  const [name, setName] = useState(props.userName);
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber);
  const onboarded = useSelector(selectOnboardingStatus);

  const submit = () => {
    props.updatePaymentMethod(name, phoneNumber);

    if (onboarded.name === OnboardingStatusNames.onboarding_complete) {
      // navigate to the next screen.
    } else {
      props.completeOnboarding();
    }
  };

  useFocusEffect(() => {
    navigation.setOptions({headerShown: false});
  });

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.container}>
            {/* Tittle section */}
            <View>
              <Text color={AppColors.light_green} displayBold>
                Enter Your M-Pesa Details.
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
                outlineColor={AppColors.yellow}
                label={'Continue'}
                warning
                labelStyle={{
                  ...FONTS.h4,
                }}
                disabled={name.length < 2 || phoneNumber.length < 10}
                onPress={() => {
                  submit();
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    marginTop: hp('15%'),
  },
  button: {
    width: wp('80.0%'),
    marginTop: hp('10%'),
  },
  buttonGroup: {
    flex: 0.23,
    justifyContent: 'space-between',
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

/**
 * Maps redux state to props.
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  userName: state.ramp_fiat_payment_methods.payment_methods.name,
  phoneNumber: state.ramp_fiat_payment_methods.payment_methods.phoneNumber,
});

const mapDispatchToProps = {
  updatePaymentMethod: generateRampActionUpdateFiatPaymentMethods,
  completeOnboarding: generateActionCompletedOnboarding,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {}

export default connector(EnterMpesaPaymentInfoScreen);
