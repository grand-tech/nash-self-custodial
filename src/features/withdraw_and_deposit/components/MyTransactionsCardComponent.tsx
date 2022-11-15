import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Identicon from 'react-native-identicon';
import {connect, ConnectedProps, useSelector} from 'react-redux';
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
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';

interface Props extends ReduxProps {
  transaction: NashEscrowTransaction;
  onFulFillRequest: any;
}

const MyTransactionsCardComponent: React.FC<Props> = (props: Props) => {
  const transaction = props.transaction;
  const rates = props.currency_conversion_rates;
  const publicAddress = useSelector(selectPublicAddress);

  const [fiatNetValue, setFiatNetValue] = useState('-');
  const [transactionStatus, setTransactionStatus] = useState('-');

  useEffect(() => {
    if (rates?.KESUSD) {
      const fiatValue = transaction.netAmount / rates?.KESUSD;
      setFiatNetValue(Number(fiatValue.toFixed(2)).toLocaleString());
    }

    let status = '';
    switch (transaction.status) {
      case 0:
        status = 'Awaiting Agent';
        break;
      case 1:
        if (
          !transaction.agentApproval &&
          transaction.agentAddress === publicAddress
        ) {
          status = 'Awaiting Client Confirmation';
        } else if (
          !transaction.clientApproval &&
          transaction.clientAddress === publicAddress
        ) {
          status = 'Awaiting Agent Confirmation';
        } else {
          status = 'Awaiting Your Confirmation';
        }
        break;
      case 3:
        status = 'Confirmed';
        break;
      default:
        status = 'Completed';
        break;
    }
    setTransactionStatus(status);
  }, [publicAddress, rates, transaction]);

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
        <Text style={{...FONTS.body2, fontSize: hp('2.7%')}}>
          {transaction.txType === TransactionType.DEPOSIT
            ? 'Deposit'
            : 'Withdrawal'}{' '}
          Request
        </Text>
        <Text h2>
          cUSD {Number(transaction.netAmount.toFixed(2)).toLocaleString()}
        </Text>
        <Text body1>Ksh {fiatNetValue}</Text>
      </View>

      <View>
        <Text body1>{transactionStatus}</Text>
        <TouchableOpacity style={style.button} onPress={fulFillRequest}>
          <Text style={style.buttonText} body3>
            Fulfill Request
          </Text>
        </TouchableOpacity>
      </View>
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
    width: wp('24%'),
    borderRadius: wp('1%'),
    borderColor: AppColors.light_green,
    borderWidth: 1,
    paddingHorizontal: wp('0.1%'),
    paddingVertical: hp('0.2%'),
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
});

const mapStateToProps = (state: RootState) => ({
  currency_conversion_rates: state.currency_conversion_rates.rates,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(MyTransactionsCardComponent);
