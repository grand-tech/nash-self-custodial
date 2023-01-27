import React, {useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Screen from '../../../app_components/Screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PinKeyPad from '../components/PinKeyPad';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {AppColors} from '../../../ui_lib_configs/colors';
import {useNavigation} from '@react-navigation/native';

import {Chip} from 'react-native-ui-lib';
import {addPinChar, deletePinChar} from '../utils';

const CreatePinScreen: React.FC = () => {
  const navigation = useNavigation();

  //Contains the pin number text as an array.
  const [pinCharArray, setPinTextArray] = useState(['', '', '', '', '', '']);
  const [hidePin, setHidePin] = useState(true);
  // The current index of the pin number entry.
  const [currentIndex, setCurrentIndex] = useState(0);

  const onDelete = () => {
    const updates = deletePinChar(currentIndex, pinCharArray);
    setCurrentIndex(updates.currentIndex);
    setPinTextArray(updates.pinArray);
  };

  /**
   * Effects the change on the pin number when a new character
   * @param pinChar the new pin number character.
   */
  const onChange = (pinChar: string) => {
    const updates = addPinChar(pinChar, currentIndex, pinCharArray);

    setPinTextArray(updates.pinArray);
    setCurrentIndex(updates.currentIndex);

    if (currentIndex === pinCharArray.length - 1) {
      let pin: string = updates.pinArray.toString().replaceAll(',', '');
      navigation.navigate('ConfirmPin', {
        pin: pin,
      });
    }
  };

  useLayoutEffect(() => {
    const headerConfigs = {
      title: '',
    };
    navigation.setOptions(headerConfigs);
  }, [navigation]);

  return (
    <Screen style={styles.screen}>
      <View style={styles.pinDisplayArea}>
        <View style={styles.enterPin}>
          <Text style={styles.pinText}>Enter PIN</Text>
        </View>

        <View style={styles.pinIcons}>
          {pinCharArray.map((text, index) => (
            <View key={index} style={styles.pinContainer}>
              {text === '' ? (
                <Text style={styles.starText} />
              ) : (
                <Text style={styles.starText}>{hidePin ? '*' : text}</Text>
              )}
            </View>
          ))}
        </View>

        {hidePin ? (
          <Chip
            label={'Show Pin'}
            onPress={() => {
              setHidePin(!hidePin);
            }}
          />
        ) : (
          <Chip
            label={'Hide Pin'}
            onPress={() => {
              setHidePin(!hidePin);
            }}
          />
          // <Text style={styles.showPin}>Hide Pin</Text>
        )}
      </View>

      <View style={styles.keyPad}>
        {/* onChange={handleChange} onDelete={onDelete} */}
        <PinKeyPad onChange={onChange} onDelete={onDelete} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  navIcon: {
    marginTop: hp('5%'),
    marginLeft: wp('5%'),
  },
  enterPin: {
    marginTop: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    ...FONTS.displayBold,
    color: AppColors.light_green,
  },
  pinIcons: {
    marginVertical: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  keyPad: {
    marginHorizontal: wp('10%'),
  },
  pinContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('10.667%'),
    height: wp('10.667%'),
    backgroundColor: AppColors.perfumeHaze,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.667%'),
    marginHorizontal: hp('0.5%'),
  },
  starText: {
    ...FONTS.h3,
    color: AppColors.green,
    alignSelf: 'center',
  },
  pinError: {
    ...FONTS.body7,
    color: AppColors.perfumeHaze,
  },
  showPin: {
    ...FONTS.body3,
    alignSelf: 'center',
  },
  pinDisplayArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreatePinScreen;
