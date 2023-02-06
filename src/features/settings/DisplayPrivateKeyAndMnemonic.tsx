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
import {connect, ConnectedProps} from 'react-redux';
import {NashCache} from '../../utils/cache';
import {
  generateActionSetEnterPIN,
  generateActionSetNormal,
} from '../ui_state_manager/action.generators';
import EnterPinModal from '../../app_components/EnterPinModal';
import {RootState} from '../../app-redux-store/store';

const DisplayPrivateKeyAndMnemonic: React.FC<Props> = (props: Props) => {
  const navigation = useNavigation();

  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const copySeedPhraseToClipBoard = () => {
    Clipboard.setString(mnemonic);
    ToastAndroid.showWithGravity(
      'Copied seed phrase.',
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
    const cachedPIN = NashCache.getPinCache();
    if (cachedPIN) {
      const rst = await getStoredMnemonic(cachedPIN);
      if (rst) {
        setMnemonic(rst);
      }
      const prKey = await getStoredPrivateKey(cachedPIN);
      if (prKey) {
        setPrivateKey(prKey);
      }
    } else if (props.status !== 'enter_pin' && !cachedPIN) {
      props.promptForPIN();
    }
  };

  const onPinMatched = async (pin: string) => {
    NashCache.setPinCache(pin);
    const rst = await getStoredMnemonic(pin);
    if (rst) {
      setMnemonic(rst);
    }
    const prKey = await getStoredPrivateKey(pin);
    if (prKey) {
      setPrivateKey(prKey);
    }
    props.returnToNormal();
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
          ...FONTS.body1,
        }}
        secondary
        onPress={() => {
          navigation.goBack();
        }}
        outline={true}
        outlineColor={AppColors.light_green}
      />
      <EnterPinModal
        target="privateKey"
        onPinMatched={onPinMatched}
        visible={props.status === 'enter_pin'}
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

const mapStateToProps = (state: RootState) => ({
  status: state.ui_state.status,
});

const mapDispatchToProps = {
  promptForPIN: generateActionSetEnterPIN,
  returnToNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface Props extends ReduxProps {}

export default connector(DisplayPrivateKeyAndMnemonic);
