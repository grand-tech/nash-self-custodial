import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {Button} from 'react-native-ui-lib';

const SettingsHomeScreen = () => {
  const navigation = useNavigation();
  return (
    <Screen>
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

export default SettingsHomeScreen;
