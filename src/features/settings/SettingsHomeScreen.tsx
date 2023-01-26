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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SettingsNavigationStackParamsList} from './navigation/navigation.params.type';
import analytics from '@react-native-firebase/analytics';

type NavigationProps = NativeStackScreenProps<
  SettingsNavigationStackParamsList,
  'SettingsHome'
>;

const SettingsHomeScreen = (props: NavigationProps) => {
  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);

  return (
    <Screen style={style.screenContainer}>
      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          props.navigation.navigate('DisplayPrivateKeyAndMnemonic');
        }}>
        <Text style={style.buttonLabelStyle}>Private Key & Mnemonic</Text>
      </TouchableOpacity>

      <HR />

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={async () => {
          setComingSoonModalVisible(true);
          await analytics().logEvent('coming_soon', {
            feature: '[settings] change pin',
            timestamp: new Date().getMilliseconds(),
          });
        }}>
        <Text style={style.buttonLabelStyle}>Change Pin</Text>
      </TouchableOpacity>

      <HR />

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          props.navigation.navigate('DisplayAccountAddress');
        }}>
        <Text style={style.buttonLabelStyle}>Account Address</Text>
      </TouchableOpacity>

      <HR />
      <HR />
      <HR />

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          props.navigation.navigate('EnterMpesaPaymentInfoScreen');
        }}>
        <Text style={style.buttonLabelStyle}>Fiat Payment</Text>
      </TouchableOpacity>

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
