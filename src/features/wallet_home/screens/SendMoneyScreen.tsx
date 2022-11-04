import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Screen from '../../../app_components/Screen';
import PinKeyPad from '../../pin/components/PinKeyPad';
import {AppColors} from '../../../ui_lib_configs/colors';
import {FONTS} from '../../../ui_lib_configs/fonts';
import DropDown from '../components/DropDown';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {Button} from 'react-native-ui-lib';
import {WalletHomeNavigationStackParamsList} from '../navigation/navigation.params.type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {StableToken} from '@celo/contractkit';

const coins = [
  {
    label: 'cUSD',
    value: StableToken.cUSD,
  },
  {
    label: 'cEUR',
    value: StableToken.cEUR,
  },
  {
    label: 'cREAL',
    value: StableToken.cREAL,
  },
];

// TODO: Re-use enter amount component.
const SendMoneyScreen: React.FC<Props> = (props: Props) => {
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState('0');
  const [coin, setCoin] = useState(StableToken.cUSD);

  const setMax = () => {
    switch (coin) {
      case 'cEUR':
        if (typeof props.cEuroBalance === 'number' && props.cEuroBalance > 0) {
          let maxAmount = 0;
          maxAmount = props.cEuroBalance - 0.01;
          setAmount(maxAmount.toFixed(2).toString());
        }
        break;
      case 'cUSD':
        if (typeof props.cUSDBalance === 'number' && props.cUSDBalance > 0) {
          let maxAmount = 0;
          maxAmount = props.cUSDBalance - 0.01;
          setAmount(maxAmount.toFixed(2).toString());
        }
        break;
      case 'cREAL':
        if (typeof props.cRealBalance === 'number' && props.cRealBalance > 0) {
          let maxAmount = 0;
          maxAmount = props.cRealBalance - 0.01;
          setAmount(maxAmount.toFixed(2).toString());
        }
        break;
      default:
        break;
    }
  };

  useFocusEffect(() => {
    props.navigation.getParent()?.setOptions({headerShown: false});
    props.navigation.setOptions({
      title: 'Enter Amount',
      headerTransparent: true,
    });

    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  const handleChange = (newValue: any) => {
    if (amount === '' && newValue === '0') {
      return null;
    }
    setAmount(amount + newValue);
  };

  function handleDelete() {
    setAmount(amount.slice(0, -1));
  }

  useFocusEffect(() => {
    if (coin === 'cREAL') {
      setBalance(props.cRealBalance.toString());
    } else if (coin === 'cEUR') {
      setBalance(props.cEuroBalance.toString());
    } else {
      setBalance(props.cUSDBalance.toString());
    }
  });

  return (
    <Screen style={style.screenContainer}>
      <Text style={{color: AppColors.brown, ...FONTS.body4}}>
        {balance} {coin} available
      </Text>
      <View style={style.amountDisplayGroup}>
        <TextInput
          style={{
            color: AppColors.green,
            ...FONTS.body1,
            fontSize: hp('4.5%'),
          }}
          value={amount}
          placeholder="0"
          editable={false}
          placeholderTextColor={AppColors.brown}
        />
        <DropDown
          label={'Select coin'}
          data={coins}
          defaultValue={'cUSD'}
          onSelect={function (item: {label: string; value: string}): void {
            setCoin(item.value as StableToken);
          }}
        />
      </View>
      <TouchableOpacity style={style.button} onPress={setMax}>
        <Text style={style.buttonText}>Max</Text>
      </TouchableOpacity>
      <View style={style.keyPadContainer}>
        <PinKeyPad onChange={handleChange} onDelete={handleDelete} />
      </View>
      <Button
        style={style.reviewButton}
        label={'Review Transaction'}
        backgroundColor={AppColors.light_green}
        labelStyle={{
          ...FONTS.h5,
        }}
        disabled={amount.length === 0}
        onPress={() => {
          // TODO: Perform validation against amount.
          props.navigation.navigate('ReviewSendTransaction', {
            address: props.route.params.address,
            amount: Number(amount),
            coin: coin,
          });
        }}
      />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5%'),
  },
  keyPadContainer: {
    paddingTop: hp('5%'),
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: wp('10%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('3%'),
    width: wp('30%'),
    borderRadius: wp('1%'),
    borderColor: AppColors.light_green,
    borderWidth: 1,
    paddingHorizontal: wp('1%'),
    backgroundColor: '#fff',
  },
  reviewButton: {},
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
  amountDisplayGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  cUSDBalance: state.wallet_balance.cUSD,
  cEuroBalance: state.wallet_balance.cEUR,
  cRealBalance: state.wallet_balance.cREAL,
  cGoldBalance: state.wallet_balance.CELO,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WalletHomeNavigationStackParamsList,
  'SendMoney'
>;

type Props = ReduxProps & StackProps;
export default connector(SendMoneyScreen);
