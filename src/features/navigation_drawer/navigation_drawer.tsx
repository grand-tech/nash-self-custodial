import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {LogOutScreen} from '../onboarding/screens/LogOutScreen';
import {SettingsStack} from '../settings/navigation/navigation.stack';
import CustomDrawerContent from './CustomDrawerContent';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {generateActionQueryBalance} from '../account_balance/redux_store/action.generators';
import {WalletHomeStack} from '../wallet_home/navigation/navigation.stack';

const Drawer = createDrawerNavigator();

export const NavigationDrawer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(generateActionQueryBalance());
  });

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={{headerTransparent: true}}>
      <Drawer.Screen name="Home" component={WalletHomeStack} />
      <Drawer.Screen
        name="Withdraw & Deposit"
        component={SettingsStack}
        // options={{headerTransparent: true}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        // options={{headerTransparent: true}}
      />
      <Drawer.Screen name="Logout" component={LogOutScreen} />
    </Drawer.Navigator>
  );
};
