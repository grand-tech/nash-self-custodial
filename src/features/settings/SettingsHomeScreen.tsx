import React, {useState} from 'react';
import Screen from '../../app_components/Screen';
import {Text} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';
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
import {HR} from '../../app_components/HRComponent';

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

      <>
        <HR />
      </>

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={async () => {
          props.navigation.navigate('ChangePinScreen');
        }}>
        <Text style={style.buttonLabelStyle}>Change Pin</Text>
      </TouchableOpacity>

      <>
        <HR />
      </>

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          props.navigation.navigate('DisplayAccountAddress');
        }}>
        <Text style={style.buttonLabelStyle}>Account Address</Text>
      </TouchableOpacity>

      <>
        <HR />
      </>

      <TouchableOpacity
        style={style.buttonStyle}
        onPress={() => {
          props.navigation.navigate('EnterPaymentInformationScreen');
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
  buttonLabelStyle: {
    ...FONTS.body1,
    alignContent: 'flex-start',
    color: AppColors.link,
  },
  buttonStyle: {
    marginVertical: hp('1%'),
    width: wp('90%'),
  },
});

export default SettingsHomeScreen;
