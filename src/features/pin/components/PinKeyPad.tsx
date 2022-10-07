import {useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../../ui_lib_configs/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FONTS} from '../../../ui_lib_configs/fonts';

/**
 * Screen component properties.
 * @typedef {Object} PinKeyPadProps properties expected by the PinKeyPad component.
 * @property { any} onChange the components to be rendered on the constructed screen.
 * @property { any } onDelete
 */
export interface PinKeyPadProps {
  onChange: any;
  onDelete: any;
}

/**
 * Custom number key pad component.
 * @param props component props.
 * @returns
 */
const PinKeyPad: React.FC<PinKeyPadProps> = props => {
  const route = useRoute();

  const handleChange = (text: string) => {
    props.onChange(text);
  };

  const handleDelete = () => {
    props.onDelete();
  };

  return (
    <View>
      <View style={styles.row}>
        <TouchableHighlight
          onPress={() => handleChange('1')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>1</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('2')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>2</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('3')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>3</Text>
        </TouchableHighlight>
      </View>

      <View style={styles.row}>
        <TouchableHighlight
          onPress={() => handleChange('4')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>4</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('5')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>5</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('6')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>6</Text>
        </TouchableHighlight>
      </View>

      <View style={styles.row}>
        <TouchableHighlight
          onPress={() => handleChange('7')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>7</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('8')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>8</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('9')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>9</Text>
        </TouchableHighlight>
      </View>

      <View style={[styles.row]}>
        <TouchableHighlight
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}
          disabled={route.name.includes('Pin')}
          onPress={() => handleChange('.')}>
          {/* Dummy key to make PinKeyPad first line position consistent */}
          <Text style={styles.number}>
            {route.name.includes('Pin') ? '' : '.'}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleChange('0')}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Text style={styles.number}>0</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleDelete()}
          underlayColor={AppColors.perfumeHaze}
          delayPressOut={100}
          style={styles.key}>
          <Icon
            name="backspace"
            size={24}
            color={AppColors.green}
            style={styles.number}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const keyWidth = wp('22%');
const keyHeight = hp('12%');

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  key: {
    width: keyWidth,
    height: keyHeight,
    borderRadius: keyWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  number: {
    ...FONTS.h4,
    color: AppColors.black,
    alignSelf: 'center',
  },
});

export default PinKeyPad;
