import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {AppColors} from '../ui_lib_configs/colors';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const height = heightPercentageToDP('100.0%');

/**
 * Screen component properties.
 * @typedef {Object} ScreenComponentProps properties expected by the screen component.
 * @property { React.ReactNode } children the components to be rendered on the constructed screen.
 * @property { any } statusBarColor
 * @property { {} } style the additional stylings of the screen.
 */

type ScreenComponentProps = PropsWithChildren<{
  statusBarColor?: string;
  style?: {};
}>;

const Screen: React.FC<ScreenComponentProps> = props => {
  return (
    <SafeAreaView>
      {Platform.OS === 'android' ? (
        <StatusBar
          backgroundColor={props.statusBarColor ?? AppColors.gray}
          barStyle="dark-content"
        />
      ) : null}
      <View style={[styles.container, props.style]}>{props.children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {},
  container: {
    flex: 1,
    backgroundColor: AppColors.gray,
    minHeight: height,
  },
});

export default Screen;
