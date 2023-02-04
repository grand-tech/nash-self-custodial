import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {FONTS} from '../../../ui_lib_configs/fonts';

interface Props extends ReduxProps {
  transaction: NashEscrowTransaction;
  onFulFillRequest: any;
}

const RequestCardComponent: React.FC<Props> = (props: Props) => {
  const transaction = props.transaction;
  const rates = props.currency_conversion_rates;

  const [fiatNetValue, setFiatNetValue] = useState('-');

  useEffect(() => {
    if (rates) {
      let rate = rates?.KESUSD;

      if (transaction.exchangeTokenLable === 'cUSD') {
        rate = rates.KESUSD;
      }

      if (transaction.exchangeTokenLable === 'cEUR') {
        rate = rates.KESEUR;
      }

      if (transaction.exchangeTokenLable === 'cREAL') {
        rate = rates.KESBRL;
      }

      const fiatValue = transaction.amount / rate;
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
          transaction.amount +
          Date.now().toString()
        }
        style={style.identicon}
        size={29}
      />
      <View>
        <Text style={style.cardTitle}>
          {transaction.txType === TransactionType.DEPOSIT
            ? 'Deposit'
            : 'Withdraw'}{' '}
          request
        </Text>
        <Text style={style.cryptoAmount}>
          {transaction.exchangeTokenLable}{' '}
          {Number(transaction.amount.toFixed(2)).toLocaleString()}
        </Text>
        <Text style={style.fiatAmount}>Ksh {fiatNetValue}</Text>
      </View>

      <TouchableOpacity style={style.button} onPress={fulFillRequest}>
        <Text style={style.buttonText}>Fulfill</Text>
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
    width: wp('19%'),
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
    ...FONTS.body3,
  },
  cardTitle: {
    ...FONTS.body1,
    fontSize: hp('2.7%'),
    color: AppColors.black,
  },
  fiatAmount: {
    ...FONTS.body1,
    color: AppColors.brown,
  },
  cryptoAmount: {
    ...FONTS.body1,
    fontWeight: '900',
    color: AppColors.black,
  },
  identicon: {
    alignSelf: 'center',
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
