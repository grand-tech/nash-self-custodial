import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFocusEffect} from '@react-navigation/native';
import {StableToken} from '@celo/contractkit';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../app-redux-store/store';
import {AppColors} from '../ui_lib_configs/colors';
import PinKeyPad from '../features/pin/components/PinKeyPad';
import DropDown from '../features/wallet_home/components/DropDown';
import {FONTS} from '../ui_lib_configs/fonts';
import {Button} from 'react-native-ui-lib';

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

const EnterAmountComponent: React.FC<Props> = (props: Props) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [coin, setCoin] = useState(StableToken.cUSD);

  const setMax = () => {
    switch (coin) {
      case 'cEUR':
        if (typeof props.cEuroBalance === 'number' && props.cEuroBalance > 0) {
          let maxAmount = 0;
          maxAmount = props.cEuroBalance - 0.09;
          setAmount(Number(maxAmount.toFixed(2)).toLocaleString());
        }
        break;
      case 'cUSD':
        if (typeof props.cUSDBalance === 'number' && props.cUSDBalance > 0) {
          let maxAmount = 0;
          maxAmount = props.cUSDBalance - 0.09;
          setAmount(Number(maxAmount.toFixed(2)).toLocaleString());
        }
        break;
      case 'cREAL':
        if (typeof props.cRealBalance === 'number' && props.cRealBalance > 0) {
          let maxAmount = 0;
          maxAmount = props.cRealBalance - 0.09;
          setAmount(Number(maxAmount.toFixed(2)).toLocaleString());
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (newValue: any) => {
    if (amount === '0' && newValue === '0') {
      return null;
    }

    if (amount.includes('.') && newValue === '.') {
      return;
    }

    if (amount === '' && newValue === '.') {
      newValue = '0.';
    }

    setAmount((amount + newValue).trim());
  };

  function handleDelete() {
    setAmount(amount.slice(0, -1));
  }

  useFocusEffect(() => {
    let b = '-';

    if (coin === 'cREAL') {
      if (typeof props.cRealBalance === 'number') {
        b = Number(props.cRealBalance.toFixed(2)).toLocaleString();
      }
    } else if (coin === 'cEUR') {
      if (typeof props.cEuroBalance === 'number') {
        b = Number(props.cEuroBalance.toFixed(2)).toLocaleString();
      }
    } else {
      if (typeof props.cUSDBalance === 'number') {
        b = Number(props.cUSDBalance.toFixed(2)).toLocaleString();
      }
    }
    setBalance(b);
  });

  return (
    <View style={style.screenContainer}>
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
        label={props.submitButtonLabel}
        backgroundColor={AppColors.light_green}
        labelStyle={style.makeRequestBtnLabel}
        disabled={Number(amount) <= 0}
        onPress={() => {
          props.onSubmit(amount, coin);
        }}
      />
    </View>
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
  makeRequestBtnLabel: {
    ...FONTS.body1,
    fontWeight: '700',
  },
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
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {
  onSubmit: (amount: string, coin: StableToken) => void;
  submitButtonLabel: string;
}

export default connector(EnterAmountComponent);
