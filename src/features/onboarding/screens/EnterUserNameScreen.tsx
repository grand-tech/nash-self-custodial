import React, {useState} from 'react';
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
import {Button, Text, TextField} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';
import Screen from '../../../app_components/Screen';
import {useNavigation} from '@react-navigation/native';

/**
 * Contains the screen to enter user name.
 */
export const EnterUserNameScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const submitName = () => {
    console.log(name);
    navigation.navigate('CreatePin');
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
              <Text color={AppColors.light_green} displayBold>
                How should we call you?
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
                  disabledColor={AppColors.brown}
                  style={style.textInput}
                  migrate
                  onChangeText={(text: string) => {
                    setName(text);
                  }}
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
                disabled={name.length < 2}
                onPress={() => {
                  submitName();
                }}
              />
            </View>
            {/* Button group section. */}
            {/* <View style={style.buttonGroup}> */}

            {/* </View> */}
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
)(EnterUserNameScreen);

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: wp('80.0%'),
    marginTop: hp('30%'),
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
  },
  textInput: {
    width: wp('70%'),
  },
});
