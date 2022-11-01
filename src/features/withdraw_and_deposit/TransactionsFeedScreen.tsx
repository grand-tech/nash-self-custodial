import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {Button} from 'react-native-ui-lib';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';

const TransactionsFeedHomeScreen = () => {
  const navigation = useNavigation();
  return (
    <Screen style={style.screenContainer}>
      <Button
        h2
        link
        label={'Private Key & Mnemonic'}
        primary
        // labelStyle={}
        labelStyle={style.buttonStyle}
        onPress={() => {
          navigation.navigate('DisplayPrivateKeyAndMnemonic');
        }}
      />
      <HR />
      <Button
        h2
        link
        label={'Change Pin'}
        primary
        onPress={() => {
          ToastAndroid.showWithGravity(
            'Coming soon.',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        }}
      />
      <HR />
      <Button
        h2
        link
        label={'Account Address'}
        primary
        onPress={() => {
          navigation.navigate('DisplayAccountAddress');
        }}
      />
      <HR />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    paddingTop: hp('7%'),
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
  buttonStyle: {
    textAlign: 'left',
    alignContent: 'flex-start',
  },
});

export default TransactionsFeedHomeScreen;

const HR = () => {
  return (
    <View style={style.hrContainer}>
      <View style={style.hr} />
      <View style={style.hr} />
    </View>
  );
};
