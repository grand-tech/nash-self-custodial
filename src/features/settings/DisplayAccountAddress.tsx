import React, {useEffect} from 'react';
import Screen from '../../app_components/Screen';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import {selectPublicAddress} from '../onboarding/redux_store/selectors';
import {useSelector} from 'react-redux';

const DisplayAccountAddress = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.getParent()?.setOptions({headerShown: false});
    navigation.setOptions({title: 'Account Address', headerTransparent: true});
    // const publicAddress = useSelector(selectPublicAddress);

    return () => {
      navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  return (
    <Screen>
      <Text>Display account address</Text>
      <QRCode value="http://awesome.link.qr" size={150} />
      <View>
        <Text></Text>
      </View>
    </Screen>
  );
};

export default DisplayAccountAddress;
