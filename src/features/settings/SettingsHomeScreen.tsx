import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {Button} from 'react-native-ui-lib';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';
import ComingSoonModalComponent from '../../app_components/ComingSoonModalComponent';

const SettingsHomeScreen = () => {
  const navigation = useNavigation();

  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);

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
        onPress={() => setComingSoonModalVisible(true)}
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

      <ComingSoonModalComponent
        visible={comingSoonModalVisible}
        onCloseModal={() => {
          setComingSoonModalVisible(false);
        }}
      />
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

export default SettingsHomeScreen;

const HR = () => {
  return (
    <View style={style.hrContainer}>
      <View style={style.hr} />
      <View style={style.hr} />
    </View>
  );
};
