import React, {useState} from 'react';
import Screen from '../../app_components/Screen';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';
import {Button} from 'react-native-ui-lib';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';
import {FONTS} from '../../ui_lib_configs/fonts';
import {TransactionType} from './sagas/nash_escrow_types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootState} from '../../app-redux-store/store';
import {
  generateActionSetEnterPIN,
  generateActionSetLoading,
  generateActionSetNormal,
} from '../ui_state_manager/action.generators';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {StableToken} from '@celo/contractkit';
import {NashCache} from '../../utils/cache';
import EnterPinModal from '../../app_components/EnterPinModal';
import LoadingModalComponent from '../../app_components/LoadingModalComponent';
import SuccessModalComponent from '../../app_components/SuccessModalComponent';
import {generateActionMakeRampExchangeRequest} from './redux_store/action.generators';
import ErrorModalComponent from '../../app_components/ErrorModalComponent';

const ConfirmTransactionDetailsScreen: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const rates = props.rates;
  const coin = props.route.params.coin;
  const amount = props.route.params.amount;
  const [fiat, setFiat] = useState('-');
  const [pin, setPin] = useState('');
  const [title, setTitle] = useState('Withdraw Request');
  const [txAction, setTxAction] = useState('withdraw');

  useFocusEffect(() => {
    if (props.route.params.transactionType === TransactionType.DEPOSIT) {
      setTitle('Deposit Request');
      setTxAction('deposit');
    }
    props.navigation.getParent()?.setOptions({headerShown: false});
    props.navigation.setOptions({
      title: title,
      headerTransparent: true,
    });

    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  useFocusEffect(() => {
    let balance = 0;

    if (coin === StableToken.cUSD && rates?.KESUSD) {
      balance = amount / rates?.KESUSD;
    }

    if (coin === StableToken.cREAL && rates?.KESBRL) {
      balance = amount / rates?.KESBRL;
    }

    if (coin === StableToken.cEUR && rates?.KESEUR) {
      balance = amount / rates?.KESEUR;
    }
    setFiat(Number(balance.toFixed(2)).toLocaleString());
  });

  const sendRequest = () => {
    const p = NashCache.getPinCache() ?? '';
    setPin(p);
    if (p !== '') {
      props.dispatchActionSetLoading(
        'Initializing ' + title.toLowerCase() + ' ...',
        '',
      );
    } else {
      props.promptForPIN();
    }
  };

  const onPinMatched = async (p: string) => {
    NashCache.setPinCache(p);
    setPin(p);
    props.dispatchActionSetLoading('Sending request', '');
  };

  const onShowLoadingModal = () => {
    props.dispatchInitializeTransaction(
      amount,
      coin,
      props.route.params.transactionType,
      pin,
    );
  };

  const onPressOkay = () => {
    if (props.ui_status !== 'loading') {
      props.navigation.navigate('TransactionsFeedScreen');
    }
  };

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <Text style={style.explanation}>I want to {txAction}:</Text>
        <View>
          <View style={style.div}>
            <Text style={style.amountLabel}>Amount</Text>
            <Text style={style.amountValue}>
              {amount} {props.route.params.coin}
            </Text>
          </View>
          <View style={style.div}>
            <Text />
            <Text style={style.amountFiatValue}>{fiat} Ksh</Text>
          </View>
        </View>
      </View>

      <Button
        label={'Make Request'}
        labelStyle={style.buttonLabel}
        secondary
        onPress={sendRequest}
        outline={true}
        outlineColor={AppColors.light_green}
      />

      <EnterPinModal
        target="privateKey"
        onPinMatched={onPinMatched}
        visible={props.ui_status === 'enter_pin' && isFocused}
      />

      <LoadingModalComponent
        TAG="ConfirmTransactionDetailsScreen"
        onShowModal={onShowLoadingModal}
        visible={props.ui_status === 'loading' && isFocused}
      />

      <SuccessModalComponent
        visible={props.ui_status === 'success' && isFocused}
        onPressOkay={onPressOkay}
      />

      <ErrorModalComponent
        visible={props.ui_status === 'error' && isFocused}
        onRetry={sendRequest}
      />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-around',
    height: hp('60%'),
    alignContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    height: hp('15%'),
    width: wp('70%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('3%'),
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    borderRadius: wp('5%'),
  },
  explanation: {
    ...FONTS.body1,
    color: AppColors.green,
    fontWeight: 'bold',
  },
  amountLabel: {
    ...FONTS.body1,
    color: AppColors.black,
  },
  amountValue: {
    ...FONTS.body1,
    color: AppColors.black,
  },
  amountFiatValue: {
    ...FONTS.body1,
    color: AppColors.brown,
  },
  buttonLabel: {
    ...FONTS.body1,
    fontWeight: '400',
  },
  div: {flexDirection: 'row', justifyContent: 'space-between'},
});

const mapStateToProps = (state: RootState) => ({
  ui_status: state.ui_state.status,
  rates: state.currency_conversion_rates.rates,
});

const mapDispatchToProps = {
  promptForPIN: generateActionSetEnterPIN,
  returnToNormal: generateActionSetNormal,
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchInitializeTransaction: generateActionMakeRampExchangeRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'ConfirmTransactionDetailsScreen'
>;
type Props = ReduxProps & StackProps;

export default connector(ConfirmTransactionDetailsScreen);
