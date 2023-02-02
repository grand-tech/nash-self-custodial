import React, {useState} from 'react';
import Screen from '../../app_components/Screen';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';
import {Button, Text} from 'react-native-ui-lib';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';
import {FONTS} from '../../ui_lib_configs/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootState} from '../../app-redux-store/store';
import {
  generateActionSetEnterPIN,
  generateActionSetLoading,
  generateActionSetNormal,
} from '../ui_state_manager/action.generators';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {NashCache} from '../../utils/cache';
import EnterPinModal from '../../app_components/EnterPinModal';
import LoadingModalComponent from '../../app_components/LoadingModalComponent';
import SuccessModalComponent from '../../app_components/SuccessModalComponent';
import {generateActionAgentFulfillRequest} from './redux_store/action.generators';
import ErrorModalComponent from '../../app_components/ErrorModalComponent';

const FulfillRequestScreen: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const transaction = props.route.params.transaction;
  const rates = props.rates;
  const [amountFiat, setAmountFiat] = useState('-');
  const [title, setTitle] = useState('Withdraw Request');

  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (transaction.txType === 'DEPOSIT') {
        setTitle('Deposit Request');
      }
      props.navigation.getParent()?.setOptions({headerShown: false});
      props.navigation.setOptions({
        title: title,
        headerTransparent: true,
      });
    });

    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  useFocusEffect(() => {
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

      let amount = 0;
      amount = transaction.amount / rate;

      setAmountFiat(Number(amount.toFixed(2)).toLocaleString());
    }
  });

  const sendRequest = () => {
    if (
      NashCache.getPinCache() !== null &&
      NashCache.getPinCache()?.trim() !== ''
    ) {
      props.dispatchActionSetLoading(
        'Accepting ' + title.toLocaleLowerCase() + ' ...',
        '',
        'Send Request',
      );
    } else {
      props.promptForPIN();
    }
  };

  const onPinMatched = async (p: string) => {
    NashCache.setPinCache(p);
    props.dispatchActionSetLoading('Accepting request ...', '');
  };

  const onShowLoadingModal = () => {
    const pin = NashCache.getPinCache();
    if (pin !== null) {
      props.dispatchFulFillTsx(transaction, pin);
    }
  };

  const onPressOkay = () => {
    props.navigation.goBack();
  };

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <View style={style.div}>
          <Text h2>Amount</Text>

          <Text h2>
            {Number(transaction.amount.toFixed(2)).toLocaleString()}{' '}
            {transaction.exchangeTokenLable}
          </Text>
        </View>
        <View style={style.div}>
          <Text h2 />
          <Text h2>{amountFiat} Ksh</Text>
        </View>
      </View>

      <Button
        label={'Fulfill Request'}
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
        visible={props.ui_status === 'enter_pin' && isFocused}
      />

      <LoadingModalComponent
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
    height: hp('30%'),
    width: wp('80%'),
    paddingHorizontal: wp('5%'),
  },
  div: {flexDirection: 'row', justifyContent: 'space-between'},
});

const mapStateToProps = (state: RootState) => ({
  ui_status: state.ui_state.status,
  rates: state.currency_conversion_rates.rates,
  stable_coins: state.stable_coin_info.addresses,
});

const mapDispatchToProps = {
  promptForPIN: generateActionSetEnterPIN,
  returnToNormal: generateActionSetNormal,
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchFulFillTsx: generateActionAgentFulfillRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'FulfillRequestScreen'
>;
type Props = ReduxProps & StackProps;

export default connector(FulfillRequestScreen);
