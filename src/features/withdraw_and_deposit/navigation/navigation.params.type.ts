import {TransactionType} from './../sagas/nash_escrow_types';

export type WithdrawalAndDepositNavigationStackParamsList = {
  TransactionsFeedScreen: undefined;
  EnterAmountScreen: {transactionType: TransactionType};
  MakeRequestScreen: undefined;
};
