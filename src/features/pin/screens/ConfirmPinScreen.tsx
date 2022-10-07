import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Screen from '../../../app_components/Screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PinKeyPad from '../components/PinKeyPad';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {AppColors} from '../../../ui_lib_configs/colors';
import {useNavigation, useRoute} from '@react-navigation/native';

import {Chip} from 'react-native-ui-lib';

const ConfirmPinScreen = () => {
  const route = useRoute();
  const pin: string = route.params?.pin ?? '';

  const navigation = useNavigation();
  const initPin = ['', '', '', '', '', ''];
  const [pinError, setPinError] = React.useState('');

  const [pinCharArray, setPinTextArray] = useState(initPin);
  const [hidePin, setHidePin] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onDelete = () => {
    if (currentIndex > 0) {
      let newPinArray = initPin;

      for (let index = 0; index < pinCharArray.length; index++) {
        if (currentIndex == index) {
          newPinArray[index] = '';
        } else {
          newPinArray[index] = pinCharArray[index];
        }
        let newCurrentIndex = currentIndex - 1;
        setCurrentIndex(newCurrentIndex);
        setPinTextArray(newPinArray);
      }
    } else {
      setCurrentIndex(0);
      setPinTextArray(initPin);
    }
  };

  const onChange = (pinChar: string) => {
    setPinError('');
    if (
      currentIndex < pinCharArray.length &&
      pinCharArray[currentIndex] === ''
    ) {
      let newPinArray = initPin;

      for (let index = 0; index < pinCharArray.length; index++) {
        if (currentIndex === index) {
          newPinArray[index] = pinChar;
        } else {
          newPinArray[index] = pinCharArray[index];
        }

        setPinTextArray(newPinArray);

        if (currentIndex < pinCharArray.length - 1) {
          // Limit the max index to the number of characters expected.
          let newCurrentIndex = currentIndex + 1;
          setCurrentIndex(newCurrentIndex);
        } else {
          let p = newPinArray.toString().replaceAll(',', '');
          if (p === pin) {
            // set up recovery phrase.
            navigation.navigate('ConfirmPin');
          } else {
            setPinError('PIN did not match!!!');
            setCurrentIndex(0);
            setPinTextArray(['', '', '', '', '', '']);
          }
        }
      }
    }
  };

  useEffect(() => {
    setPinTextArray(initPin);
    setCurrentIndex(0);
  }, []);

  useLayoutEffect(() => {
    const headerConfigs = {
      title: '',
    };
    navigation.setOptions(headerConfigs);
  }, [navigation]);

  return (
    <Screen style={styles.screen}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.enterPin}>
          <Text style={styles.pinText}>Confirm PIN</Text>
        </View>

        <View style={{alignSelf: 'center'}}>
          <Text style={styles.pinError}>{pinError}</Text>
        </View>

        <View style={styles.pinIcons}>
          {pinCharArray.map((text, index) => (
            <View key={index} style={styles.pinContainer}>
              {text == '' ? (
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
    color: AppColors.red,
  },
  showPin: {
    ...FONTS.body1,
    alignSelf: 'center',
  },
});

export default ConfirmPinScreen;
