import {Actions} from './action.patterns';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';
import {StableToken} from '@celo/contractkit';
import {
  ActionQueryMyTransactions,
  ActionSetMyTransactions,
  ActionApproveTransaction,
  ActionCancelTransaction,
  ActionUpdatePendingTransaction,
  ActionUpdateMyTransaction,
  ActionAgentFulfillRequest,
  ActionMakeRampRequest,
  ActionQueryPendingTransactions,
  ActionSetPendingTransactions,
} from './actions';
import {
  DataQueryTriggers,
  ListUpdateActions,
  QueryTransactionsUserActions,
} from './enums';

export function generateActionQueryPendingTransactions(
  userAction: QueryTransactionsUserActions,
  trigger: DataQueryTriggers,
): ActionQueryPendingTransactions {
  return {
    type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS,
    userAction,
    trigger,
  };
}

export function generateActionSetPendingTransactions(
  transactions: Array<NashEscrowTransaction>,
): ActionSetPendingTransactions {
  return {
    type: Actions.SET_PENDING_TRANSACTION_LISTS,
    transactions,
  };
}

export function generateActionQueryMyTransactions(
  userAction: QueryTransactionsUserActions,
  statuses: number[],
  trigger: DataQueryTriggers,
): ActionQueryMyTransactions {
  return {
    type: Actions.QUERY_MY_TRANSACTION_REQUESTS,
    userAction,
    statuses,
    trigger,
  };
}

export function generateActionSetMyTransactions(
  transactions: Array<NashEscrowTransaction>,
): ActionSetMyTransactions {
  return {
    type: Actions.SET_MY_TRANSACTION_LISTS,
    transactions,
  };
}

export function generateActionMakeRampExchangeRequest(
  amount: number,
  coin: StableToken,
  transactionType: TransactionType,
  pin: string,
): ActionMakeRampRequest {
  return {
    type: Actions.MAKE_RAMP_EXCHANGE_REQUEST,
    amount,
    coin,
    transactionType,
    pin,
  };
}

export function generateActionAgentFulfillRequest(
  transaction: NashEscrowTransaction,
  pin: string,
): ActionAgentFulfillRequest {
  return {
    type: Actions.AGENT_FULFILL_REQUEST,
    transaction,
    pin,
  };
}

export function generateActionApproveTransaction(
  transaction: NashEscrowTransaction,
  pin: string,
): ActionApproveTransaction {
  return {
    type: Actions.APPROVE_TRANSACTION,
    transaction,
    pin,
  };
}

export function generateActionCancelTransaction(
  transaction: NashEscrowTransaction,
  pin: string,
): ActionCancelTransaction {
  return {
    type: Actions.CANCEL_TRANSACTION,
    transaction,
    pin,
  };
}

export function generateActionUpdatePendingTransactions(
  transaction: NashEscrowTransaction,
  action: ListUpdateActions,
): ActionUpdatePendingTransaction {
  return {
    type: Actions.UPDATE_PENDING_TRANSACTION_LISTS,
    transaction,
    action,
  };
}

export function generateActionUpdateMyTransactions(
  transaction: NashEscrowTransaction,
  action: ListUpdateActions,
): ActionUpdateMyTransaction {
  return {
    type: Actions.UPDATE_MY_TRANSACTION_LISTS,
    transaction,
    action,
  };
}
