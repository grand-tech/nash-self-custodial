import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {AppColors} from '../../ui_lib_configs/colors';
import {FONTS} from '../../ui_lib_configs/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Pressable} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Button, Text} from 'react-native-ui-lib';
import {getStoredMnemonic, getStoredPrivateKey} from '../onboarding/utils';

const DisplayPrivateKeyAndMnemonic = () => {
  const navigation = useNavigation();

  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const copySeedPhraseToClipBoard = () => {
    Clipboard.setString(mnemonic);
    ToastAndroid.showWithGravity(
      'Copied seedphrase.',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({headerShown: false});
    navigation.setOptions({
      title: 'Seed Phrase & Private Key',
      headerTransparent: true,
    });
    fetchStoredKeys();
    return () => {
      navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  const fetchStoredKeys = async () => {
    const rst = await getStoredMnemonic('202222');
    if (rst) {
      setMnemonic(rst);
    }
    const prKey = await getStoredPrivateKey('202222');
    if (prKey) {
      setPrivateKey(prKey);
    }
  };

  return (
    <Screen style={style.screenContainer}>
      <View
        style={style.textGroup}
        onTouchEnd={() => {
          copySeedPhraseToClipBoard();
        }}>
        <TextInput
          editable={false}
          multiline
          numberOfLines={4}
          value={mnemonic}
          style={style.textInputStyle}
        />
      </View>

      <Pressable
        onPress={() => {
          Clipboard.setString(privateKey);
          ToastAndroid.showWithGravity(
            'Copied private key.',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        }}>
        <View style={style.privateKeyView}>
          <Icon
            name="copy"
            color={AppColors.green}
            size={20}
            style={style.copyIcon}
          />
          <Text body4 style={style.privateKey}>
            {privateKey}
          </Text>
        </View>
      </Pressable>

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
  textGroup: {
    justifyContent: 'space-around',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#ffff',
    borderRadius: wp('5%'),
    maxWidth: wp('80%'),
  },
  screenContainer: {
    justifyContent: 'space-around',
    height: hp('60%'),
    alignContent: 'center',
    alignItems: 'center',
  },
  privateKeyView: {
    backgroundColor: '#ffff',
    width: wp('90%'),
    alignContent: 'center',
    padding: wp('3%'),
    flexDirection: 'row',
    borderRadius: wp('2%'),
    maxWidth: wp('80%'),
  },
  privateKey: {
    textAlign: 'center',
    maxWidth: wp('65%'),
    color: AppColors.green,
  },
  copyIcon: {
    paddingRight: wp('3%'),
    paddingLeft: wp('1%'),
  },
  textInputStyle: {
    ...FONTS.body1,
    textAlign: 'center',
    color: AppColors.green,
  },
});
export default DisplayPrivateKeyAndMnemonic;
