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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from '../navigation/navigation.params.type';
import {NextUserAction} from '../transaction.user.actions.enum';
import {generateActionAddClientPaymentInfoToTx} from '../../comment_encryption/redux_store/action.generators';

interface Props extends ReduxProps {
  transaction: NashEscrowTransaction;
  performNextUserAction: any;
  navigation: NativeStackNavigationProp<
    WithdrawalAndDepositNavigationStackParamsList,
    'MyTransactionsFeedScreen',
    undefined
  >;
}

const MyTransactionsCardComponent: React.FC<Props> = (props: Props) => {
  const transaction = props.transaction;
  const rates = props.currency_conversion_rates;
  const publicAddress = useSelector(selectPublicAddress);

  const [fiatNetValue, setFiatNetValue] = useState('-');
  const [transactionStatus, setTransactionStatus] = useState('-');
  const [nextUserAction, setNextUserAction] = useState(NextUserAction.NONE);
  const [symbol, setSymbol] = useState('cUSD');

  useEffect(() => {
    if (rates?.KESUSD) {
      let rate = rates?.KESUSD;
      for (const coin of props.stable_coins) {
        if (coin.address === props.transaction.enxchangeToken) {
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
      let fiatValue = transaction.netAmount / rate;
      setFiatNetValue(Number(fiatValue.toFixed(2)).toLocaleString());
    }

    let status = '';
    switch (transaction.status) {
      case 0:
        status = 'Awaiting Agent';
        setNextUserAction(NextUserAction.CANCEL);
        break;
      case 1:
        if (
          transaction.agentApproval &&
          transaction.agentAddress === publicAddress
        ) {
          status = 'Awaiting Client Approval';
          setNextUserAction(NextUserAction.NONE);
        } else if (
          transaction.clientApproval &&
          transaction.clientAddress === publicAddress
        ) {
          status = 'Awaiting Agent Approval';
          setNextUserAction(NextUserAction.NONE);
        } else {
          status = 'Awaiting Your Confirmation';
          if (transaction.agentAddress === publicAddress) {
            setNextUserAction(NextUserAction.APPROVE);
          } else if (transaction.clientAddress === publicAddress) {
            setNextUserAction(NextUserAction.APPROVE);
          }
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

  useEffect(() => {
    if (
      transaction.clientAddress === publicAddress &&
      transaction.clientPaymentDetails === '' &&
      transaction.status !== 0
    ) {
      props.generateActionAddClientPaymentInfo(transaction);
    }
  });

  const onPress = () => {
    props.performNextUserAction(nextUserAction, transaction);
  };

  const onCardPress = () => {
    props.navigation.navigate('ViewRequestScreen', {transaction});
  };

  return (
    <>
      <TouchableOpacity onPress={onCardPress}>
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
              {symbol}{' '}
              {Number(transaction.netAmount.toFixed(2)).toLocaleString()}
            </Text>
            <Text body3>Ksh {fiatNetValue}</Text>
            <Text body3 style={style.statusText}>
              {transactionStatus}
            </Text>
          </View>

          <View>
            <Text s5>{transaction.id}</Text>
            {nextUserAction !== NextUserAction.NONE ? (
              <TouchableOpacity style={style.button} onPress={onPress}>
                <Text style={style.buttonText} body3>
                  {nextUserAction.valueOf()}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={style.invisibleButton} disabled={true}>
                <Text style={style.buttonText} body3>
                  {nextUserAction.valueOf()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
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
  invisibleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('24%'),
    paddingHorizontal: wp('0.1%'),
    paddingVertical: hp('0.2%'),
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  statusText: {
    fontWeight: 'bold',
    color: AppColors.green,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
});

const mapStateToProps = (state: RootState) => ({
  currency_conversion_rates: state.currency_conversion_rates.rates,
  ui_status: state.ui_state.status,
  stable_coins: state.stable_coin_info.addresses,
});

const mapDispatchToProps = {
  generateActionAddClientPaymentInfo: generateActionAddClientPaymentInfoToTx,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(MyTransactionsCardComponent);
