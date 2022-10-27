import React from 'react';
import {Button, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {LogOutScreen} from '../onboarding/screens/LogOutScreen';
import SettingsScreen from '../settings/SettingsScreen';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to notifications"
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export const NavigationDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Logout" component={LogOutScreen} />
    </Drawer.Navigator>
  );
};
