import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {Button} from 'react-native-ui-lib';

const DisplayPrivateKeyAndMnemonic = () => {
  const navigation = useNavigation();
  return (
    <Screen>
      <Button
        h1
        link
        label={'Private Key & Mnemonic'}
        onPress={() => {
          navigation.navigate();
        }}
      />

      <Button
        h1
        link
        label={'Change Pin'}
        onPress={() => {
          navigation.navigate();
        }}
      />

      <Button
        h1
        link
        label={'Account Address'}
        onPress={() => {
          navigation.navigate();
        }}
      />
    </Screen>
  );
};

export default DisplayPrivateKeyAndMnemonic;
