import {StableToken} from '@celo/contractkit';
import {
  NashEscrowTransaction,
  TransactionType,
} from './../sagas/nash_escrow_types';

export type WithdrawalAndDepositNavigationStackParamsList = {
  TransactionsFeedScreen: undefined;
  MyTransactionsFeedScreen: undefined;
  EnterAmountScreen: {transactionType: TransactionType};
  ConfirmTransactionDetailsScreen: {
    amount: number;
    coin: StableToken;
    transactionType: TransactionType;
  };
  FulfillRequestScreen: {transaction: NashEscrowTransaction};
  ViewRequestScreen: {transaction: NashEscrowTransaction};
};
