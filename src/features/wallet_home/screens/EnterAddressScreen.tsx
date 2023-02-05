import React, {useState} from 'react';
import {
  InteractionManager,
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
import {Button, TextField} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';
import Screen from '../../../app_components/Screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {web3} from '../../account_balance/contract.kit.utils';

/**
 * Contains the screen to enter user name.
 */
const EnterAddressScreen = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');

  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      navigation.getParent()?.setOptions({headerShown: false});
      navigation.setOptions({
        title: 'Send Funds',
        headerTransparent: true,
      });

      return () => {
        navigation.getParent()?.setOptions({headerShown: true});
      };
    });
  });

  const submitAddress = () => {
    navigation.navigate('SendMoney', {address: address});
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.container}>
            {/* Tittle section */}
            <View
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Text color={AppColors.light_green} body1>
                Enter recipient address.
              </Text> */}

              {/* Body text group section. */}
              <View style={style.textGroup}>
                <TextField
                  body1
                  color={AppColors.black}
                  containerStyle={{marginBottom: hp('1.00%')}}
                  floatingPlaceholder
                  placeholder="Enter recipient address"
                  maxLength={200}
                  editable={true}
                  disabledColor={AppColors.brown}
                  style={style.textInput}
                  migrate
                  onChangeText={(text: string) => {
                    setAddress(text);
                    web3.utils.isAddress(address);
                  }}
                />
              </View>

              <Button
                style={style.button}
                label={'Continue'}
                backgroundColor={AppColors.light_green}
                labelStyle={{
                  ...FONTS.body1,
                }}
                disabled={!web3.utils.isAddress(address)}
                onPress={() => {
                  submitAddress();
                }}
              />
            </View>
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
  userName: state.onboarding.user_name,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EnterAddressScreen);

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
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
    width: wp('80%'),
  },
});
