import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {Text} from 'react-native-ui-lib';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';
import ComingSoonModalComponent from '../../app_components/ComingSoonModalComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FONTS} from '../../ui_lib_configs/fonts';

const SettingsHomeScreen = () => {
  const navigation = useNavigation();

  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);

  return (
    <Screen style={style.screenContainer}>
      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          navigation.navigate('DisplayPrivateKeyAndMnemonic');
        }}>
        <Text style={style.buttonLabelStyle}>Private Key & Mnemonic</Text>
      </TouchableOpacity>

      <HR />

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => setComingSoonModalVisible(true)}>
        <Text style={style.buttonLabelStyle}>Change Pin</Text>
      </TouchableOpacity>

      <HR />

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          navigation.navigate('DisplayAccountAddress');
        }}>
        <Text style={style.buttonLabelStyle}>Account Address</Text>
      </TouchableOpacity>

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
    paddingHorizontal: wp('4%'),
    alignItems: 'flex-start',
  },
  hr: {flex: 1, height: 0.5, backgroundColor: AppColors.brown},
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLabelStyle: {
    ...FONTS.h3,
    alignContent: 'flex-start',
    color: AppColors.link,
  },
  buttonStyle: {
    marginVertical: hp('1%'),
    width: wp('90%'),
  },
});

export default SettingsHomeScreen;

const HR = () => {
  return (
    <View style={style.hrContainer}>
      <View style={style.hr} />
    </View>
  );
};
