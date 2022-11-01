import React from 'react';
import Screen from '../../app_components/Screen';
import {Pressable, StyleSheet, ToastAndroid, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import {selectPublicAddress} from '../onboarding/redux_store/selectors';
import {useSelector} from 'react-redux';
import {Button, Text} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';
import {FONTS} from '../../ui_lib_configs/fonts';
import Clipboard from '@react-native-clipboard/clipboard';

const SendMoneyScreen = () => {
  const navigation = useNavigation();

  const publicAddress = useSelector(selectPublicAddress);

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <QRCode value={publicAddress} size={150} color={AppColors.green} />

        <View style={style.hrContainer}>
          <View style={style.hr} />
          <View>
            <Text style={style.hrText}>or</Text>
          </View>
          <View style={style.hr} />
        </View>

        <Pressable
          onPress={() => {
            Clipboard.setString(publicAddress);
            ToastAndroid.showWithGravity(
              'Copied public address.',
              ToastAndroid.SHORT,
              ToastAndroid.TOP,
            );
          }}>
          <View style={style.publicAddressView}>
            <Icon
              name="copy"
              color={AppColors.green}
              size={20}
              style={style.copyIcon}
            />
            <Text body4 style={style.publicAddress}>
              {publicAddress}
            </Text>
          </View>
        </Pressable>
      </View>

      <Button
        label={'Done'}
        labelStyle={{
          ...FONTS.h4,
        }}
        secondary
        onPress={() => {
          navigation.goBack();
        }}
        outline={true}
        outlineColor={AppColors.light_green}
      />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-around',
    height: hp('60%'),
    alignContent: 'center',
    alignItems: 'center',
  },
  publicAddressView: {
    backgroundColor: '#ffff',
    width: wp('95%'),
    alignContent: 'center',
    padding: wp('3%'),
    flexDirection: 'row',
    borderRadius: wp('2%'),
  },
  publicAddress: {
    textAlign: 'center',
    color: AppColors.green,
  },
  copyIcon: {
    paddingRight: wp('3%'),
    paddingLeft: wp('1%'),
  },
  contentContainer: {
    justifyContent: 'space-around',
    height: hp('50%'),
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  hr: {flex: 1, height: 1, backgroundColor: AppColors.light_green},
  hrText: {
    width: 50,
    textAlign: 'center',
    color: AppColors.light_green,
  },
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SendMoneyScreen;
