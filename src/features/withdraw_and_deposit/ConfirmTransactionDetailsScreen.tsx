import React, {useState} from 'react';
import Screen from '../../app_components/Screen';
import {StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';
import {Button, Text} from 'react-native-ui-lib';
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
  const rates = props.rates;
  const coin = props.route.params.coin;
  const amount = props.route.params.amount;
  const [fiat, setFiat] = useState('-');
  const [pin, setPin] = useState('');
  const [title, setTitle] = useState('Withdraw Request');

  useFocusEffect(() => {
    if (props.route.params.transactionType === TransactionType.DEPOSIT) {
      setTitle('Deposit Request');
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
        'Initialzing ' + title.toLowerCase() + ' ...',
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
    props.navigation.navigate('TransactionsFeedScreen');
  };

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <View style={style.div}>
          <Text h2>Amount</Text>
          <Text h2>
            {amount} {props.route.params.coin}
          </Text>
        </View>
        <View style={style.div}>
          <Text h2 />
          <Text h2>{fiat} Ksh</Text>
        </View>
      </View>

      <Button
        label={'Make Request'}
        labelStyle={{
          ...FONTS.h4,
        }}
        secondary
        onPress={sendRequest}
        outline={true}
        outlineColor={AppColors.light_green}
      />

      <EnterPinModal
        target="privateKey"
        onPinMatched={onPinMatched}
        visible={props.ui_status === 'enter_pin'}
      />

      <LoadingModalComponent
        onShowModal={onShowLoadingModal}
        visible={props.ui_status === 'loading'}
      />

      <SuccessModalComponent
        visible={props.ui_status === 'success'}
        onPressOkay={onPressOkay}
      />

      <ErrorModalComponent
        visible={props.ui_status === 'error'}
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
    height: hp('30%'),
    width: wp('80%'),
    paddingHorizontal: wp('5%'),
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
