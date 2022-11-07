import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {StyleSheet} from 'react-native';
import {
  // widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect, ConnectedProps} from 'react-redux';
import {
  generateActionSetEnterPIN,
  generateActionSetNormal,
} from '../ui_state_manager/action.generators';
import {RootState} from '../../app-redux-store/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import EnterAmountComponent from '../../app_components/EnterAmountComponent';
import {StableToken} from '@celo/contractkit';
import {TransactionType} from './sagas/nash_escrow_types';

const EnterAmountScreen: React.FC<Props> = (props: Props) => {
  const onSubmit = (amount: string, coin: StableToken) => {
    props.navigation.navigate('ConfirmTransactionDetailsScreen', {
      amount: Number(amount),
      coin: coin,
      transactionType: props.route.params.transactionType,
    });
  };

  useFocusEffect(() => {
    let title = 'Enter Amount To Withdraw';
    if (props.route.params.transactionType === TransactionType.DEPOSIT) {
      title = 'Enter Amount To Deposit';
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

  return (
    <Screen style={style.screenContainer}>
      <EnterAmountComponent onSubmit={onSubmit} submitButtonLabel={'Review'} />
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
});

const mapStateToProps = (state: RootState) => ({
  status: state.ui_state.status,
});

const mapDispatchToProps = {
  promptForPIN: generateActionSetEnterPIN,
  returnToNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'EnterAmountScreen'
>;
type Props = ReduxProps & StackProps;

export default connector(EnterAmountScreen);
