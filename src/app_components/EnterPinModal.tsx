import React, {useState} from 'react';
import {View, StyleSheet, Modal, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Chip, Text} from 'react-native-ui-lib';
import {RootState} from '../app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';
import PinKeyPad from '../features/pin/components/PinKeyPad';
import Screen from './Screen';
import {addPinChar, deletePinChar} from '../features/pin/utils';
import {
  getStoredMnemonic,
  getStoredPrivateKey,
} from '../features/onboarding/utils';
import {AppColors} from '../ui_lib_configs/colors';
import {FONTS} from '../ui_lib_configs/fonts';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {generateActionSetNormal} from '../features/ui_state_manager/action.generators';
import {NashCache} from '../utils/cache';

const EnterPinModal: React.FC<Props> = (props: Props) => {
  const navigation = useNavigation();
  const target: string = props.target ?? 'privateKey';

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
    try {
      if (target === 'mnemonic') {
        retrievedItem = await getStoredMnemonic(pin);
      } else {
        retrievedItem = await getStoredPrivateKey(pin);
      }

      if (retrievedItem === null || retrievedItem.trim() === '') {
        setPinError('Invalid PIN!!!');
        setCurrentIndex(0);
        setPinTextArray(['', '', '', '', '', '']);
      } else {
        NashCache.setPinCache(pin);
        props.onPinMatched(pin);
      }
    } catch (error) {
      setPinError('Invalid PIN!!!');
      reset();
    }
  };

  const reset = () => {
    setPinTextArray(['', '', '', '', '', '']);
    setCurrentIndex(0);
  };

  const onShow = () => {
    reset();
    setHidePin(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onShow={onShow}>
      <Screen style={styles.screen}>
        <View style={styles.closeIcon}>
          <Pressable
            onPress={() => {
              props.dispatchActionSetNormal();
              navigation.goBack();
            }}>
            <Icon light={true} name="times" size={30} color={AppColors.black} />
          </Pressable>
        </View>

        <View style={styles.screenTitle}>
          <View style={styles.enterPin}>
            <Text style={styles.pinText}>Enter PIN</Text>
          </View>

          <View style={styles.errorDisplay}>
            <Text style={styles.pinError}>{pinError}</Text>
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
          <PinKeyPad onChange={onChange} onDelete={onDelete} isPin={true} />
        </View>
      </Screen>
    </Modal>
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
    ...FONTS.h5,
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
  screenTitle: {alignItems: 'center', justifyContent: 'center'},
  errorDisplay: {alignSelf: 'center'},
  closeIcon: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingEnd: wp('5%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  status: state.ui_state.status,
});

const mapDispatchToProps = {
  dispatchActionSetNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface Props extends ReduxProps {
  visible: boolean;
  onPinMatched: any;
  target: string;
}

export default connector(EnterPinModal);
