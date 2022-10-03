import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React from "react";

/**
 * Screen component properties.
 * @typedef {Object} ScreenComponentProps properties expected by the screen component.
 * @property { React.ReactNode } childComponents the components to be rendered on the constructed screen.
 * @property { any } statusBarColor
 * @property { {} } style the additional stylings of the screen.
 */
interface ScreenComponentProps {
  childComponents?: React.ReactNode;
  statusBarColor?: any;
  style?: {};
}

const Screen: React.FC<ScreenComponentProps> = (props) => {
  return (
    <SafeAreaView style={[styles, props.style]}>
      {Platform.OS === "android" ? (
        <StatusBar
          backgroundColor={props.statusBarColor}
          barStyle='dark-content'
        />
      ) : null}
      {props.childComponents}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default Screen;
