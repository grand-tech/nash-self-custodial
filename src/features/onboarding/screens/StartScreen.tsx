import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  Incubator,
  Colors,
  Typography,
  Button,
} from "react-native-ui-lib";

export default class StartScreen extends Component {
  render() {
    return (
      <View>
        <Incubator.WheelPicker
          items={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Maybe", value: "maybe" },
          ]}
          initialValue={"yes"}
          onChange={() => console.log("changed")}
        ></Incubator.WheelPicker>
      </View>
    );
  }
}
