import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {Button} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SettingsHomeScreen = () => {
  const navigation = useNavigation();
  return (
    <Screen style={style.screenContainer}>
      <Button
        h1
        link
        label={'Private Key & Mnemonic'}
        onPress={() => {
          navigation.navigate('DisplayPrivateKeyAndMnemonic');
        }}
      />

      <Button
        h1
        link
        label={'Change Pin'}
        onPress={() => {
          navigation.navigate('EnterPin');
        }}
      />

      <Button
        h1
        link
        label={'Account Address'}
        onPress={() => {
          navigation.navigate('DisplayAccountAddress');
        }}
      />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    paddingTop: hp('5%'),
  },
});

export default SettingsHomeScreen;
