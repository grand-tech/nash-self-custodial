import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Identicon from 'react-native-identicon';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';
import {Text} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';

interface Props extends ReduxProps {
  transaction: NashEscrowTransaction;
  onFulFillRequest: any;
}

const RequestCardComponent: React.FC<Props> = (props: Props) => {
  const transaction = props.transaction;
  const rates = props.currency_conversion_rates;

  const [fiatNetValue, setFiatNetValue] = useState('-');
  const [symbol, setSymbol] = useState('cUSD');

  useEffect(() => {
    if (rates) {
      let rate = rates?.KESUSD;
      for (const coin of props.stable_coins) {
        if (coin.address === transaction.enxchangeToken) {
          if (coin.symbol === 'cUSD') {
            rate = rates.KESUSD;
          }

          if (coin.symbol === 'cEUR') {
            rate = rates.KESEUR;
          }

          if (coin.symbol === 'cREAL') {
            rate = rates.KESBRL;
          }
          setSymbol(coin.symbol);
        }
      }

      const fiatValue = transaction.netAmount / rate;
      setFiatNetValue(Number(fiatValue.toFixed(2)).toLocaleString());
    }
  }, [rates, transaction]);

  const fulFillRequest = () => {
    props.onFulFillRequest(transaction);
  };

  return (
    <View style={style.cardContainer}>
      <Identicon
        value={
          transaction.agentAddress +
          transaction.id +
          transaction.clientAddress +
          transaction.netAmount +
          Date.now().toString()
        }
        style={{marginTop: hp('0.9%')}}
        size={29}
      />
      <View>
        <Text style={{...FONTS.h1, fontSize: hp('2.7%')}}>
          {transaction.txType === TransactionType.DEPOSIT
            ? 'Deposit'
            : 'Withdrawal'}{' '}
          Request
        </Text>
        <Text h2>
          {symbol} {Number(transaction.netAmount.toFixed(2)).toLocaleString()}
        </Text>
        <Text body1>Ksh {fiatNetValue}</Text>
      </View>

      <TouchableOpacity style={style.button} onPress={fulFillRequest}>
        <Text style={style.buttonText} body3>
          Fulfill Request
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffff',
    marginVertical: hp('1%'),
    paddingVertical: hp('1%'),
    marginHorizontal: wp('2%'),
    borderRadius: wp('2.5%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: hp('4%'),
    width: wp('24%'),
    borderRadius: wp('1%'),
    borderColor: AppColors.light_green,
    borderWidth: 1,
    paddingHorizontal: wp('0.1%'),
    paddingVertical: hp('0.2%'),
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
});

const mapStateToProps = (state: RootState) => ({
  currency_conversion_rates: state.currency_conversion_rates.rates,
  stable_coins: state.stable_coin_info.addresses,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(RequestCardComponent);
