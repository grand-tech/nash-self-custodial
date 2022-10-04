import React, {Component} from 'react';
import {View, Incubator, Text} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';

export default class StartScreen extends Component {
  render() {
    return (
      <View>
        <Incubator.WheelPicker
          items={[
            {label: 'Yes', value: 'yes'},
            {label: 'No', value: 'no'},
            {label: 'Maybe', value: 'maybe'},
          ]}
          initialValue={'yes'}
          onChange={() => console.log('changed')}
        />
        <Text h1 success>
          test Text
        </Text>
      </View>
    );
  }
}
