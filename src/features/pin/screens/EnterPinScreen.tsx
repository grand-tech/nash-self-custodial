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
import {getStoredMnemonic, getStoredPrivateKey} from '../../onboarding/utils';
import {addPinChar, deletePinChar} from '../utils';

const EnterPinScreen = () => {
  const route = useRoute();
  const nextRoute: string = route.params?.nextRoute ?? '';
  const target: string = route.params?.target ?? 'privateKey';

  const navigation = useNavigation();
  const [pinError, setPinError] = React.useState('');

  const [pinCharArray, setPinTextArray] = useState(['', '', '', '', '', '']);
  const [hidePin, setHidePin] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onDelete = () => {
    const updates = deletePinChar(currentIndex, pinCharArray);
    setCurrentIndex(updates.currentIndex);
    setPinTextArray(updates.pinArray);
  };

  const onChange = async (pinChar: string) => {
    setPinError('');
    const updates = addPinChar(pinChar, currentIndex, pinCharArray);

    setPinTextArray(updates.pinArray);
    setCurrentIndex(updates.currentIndex);

    if (currentIndex === pinCharArray.length - 1) {
      // validate pin and navigate to next screen
      let p = updates.pinArray.toString().replaceAll(',', '');
      await handlePinValidation(p);
    }
  };

  /**
   * Decrypts the target item for use if the user enters the correct PIN.
   * @param pin the pin number used as the encryption key.
   */
  const handlePinValidation = async (pin: string) => {
    let retrievedItem: string | null;
    if (target === 'mnemonic') {
      retrievedItem = await getStoredMnemonic(pin);
    } else {
      retrievedItem = await getStoredPrivateKey(pin);
    }

    if (retrievedItem === null) {
      setPinError('Invalid PIN!!!');
      setCurrentIndex(0);
      setPinTextArray(['', '', '', '', '', '']);
    } else {
      if (target === 'mnemonic') {
        navigation.navigate(nextRoute, {mnemonic: retrievedItem});
      } else {
        navigation.navigate(nextRoute, {privateKey: retrievedItem});
      }
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
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.enterPin}>
          <Text style={styles.pinText}>Enter PIN</Text>
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

export default EnterPinScreen;
