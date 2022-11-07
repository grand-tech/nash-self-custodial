import {StableToken} from '@celo/contractkit';
import {TransactionType} from './../sagas/nash_escrow_types';

export type WithdrawalAndDepositNavigationStackParamsList = {
  TransactionsFeedScreen: undefined;
  EnterAmountScreen: {transactionType: TransactionType};
  ConfirmTransactionDetailsScreen: {
    amount: number;
    coin: StableToken;
    transactionType: TransactionType;
  };
};
