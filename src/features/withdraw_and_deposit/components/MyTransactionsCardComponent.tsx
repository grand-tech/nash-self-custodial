import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
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

  useEffect(() => {
    if (rates?.KESUSD) {
      let rate = rates?.KESUSD;

      if (props.transaction.exchangeTokenLable === 'cUSD') {
        rate = rates.KESUSD;
      }

      if (props.transaction.exchangeTokenLable === 'cEUR') {
        rate = rates.KESEUR;
      }

      if (props.transaction.exchangeTokenLable === 'cREAL') {
        rate = rates.KESBRL;
      }

      let fiatValue = transaction.amount / rate;
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
          status = 'Awaiting Client`s Approval';
          setNextUserAction(NextUserAction.NONE);
        } else if (
          transaction.clientApproval &&
          transaction.clientAddress === publicAddress
        ) {
          status = 'Awaiting Agent Approval';
          setNextUserAction(NextUserAction.NONE);
        } else {
          status = 'Awaiting Your Approval';
          if (transaction.agentAddress === publicAddress) {
            setNextUserAction(NextUserAction.APPROVE);
          } else if (transaction.clientAddress === publicAddress) {
            setNextUserAction(NextUserAction.APPROVE);
          }
        }
        break;
      case 2:
        status = 'Confirmed';
        break;
      case 3:
        status = 'Canceled';
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
      transaction.status !== 0 &&
      transaction.status !== 3
    ) {
      props.generateActionAddClientPaymentInfo(transaction);
    }
  });

  const onPress = () => {
    props.performNextUserAction(nextUserAction, transaction);
  };

  const onCardPress = () => {
    if (props.ui_status !== 'loading') {
      props.navigation.navigate('ViewRequestScreen', {transaction});
    }
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

          <View>
            <Text style={style.statusText}>{transactionStatus}</Text>
            {nextUserAction !== NextUserAction.NONE ? (
              <TouchableOpacity style={style.button} onPress={onPress}>
                <Text style={style.buttonText}>{nextUserAction.valueOf()}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={style.invisibleButton} disabled={true}>
                <Text style={style.buttonText}>{nextUserAction.valueOf()}</Text>
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
    marginTop: hp('1.5%'),
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
    maxWidth: wp('25%'),
    textAlign: 'center',
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
  identicon: {
    alignSelf: 'center',
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
