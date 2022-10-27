import React, {useEffect} from 'react';
import Screen from '../../app_components/Screen';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DisplayAccountAddress = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.getParent()?.setOptions({headerShown: false});
    navigation.setOptions({title: 'Account Address', headerTransparent: true});
    return () => {
      navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  return (
    <Screen>
      <Text>Display account address</Text>
    </Screen>
  );
};

export default DisplayAccountAddress;
