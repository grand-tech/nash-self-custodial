import {Actions} from './action.patterns';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';
import {StableToken} from '@celo/contractkit';
import {ActionQueryMyTransactions, ActionSetMyTransactions} from './actions';
import {
  ActionAgentFulfillRequest,
  ActionMakeRampRequest,
  ActionQueryPendingTransactions,
  ActionSetPendingTransactions,
  QueryTransactionsUserActions,
} from './actions';

export function generateActionQueryPendingTransactions(
  userAction: QueryTransactionsUserActions,
): ActionQueryPendingTransactions {
  return {
    type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS,
    userAction,
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
): ActionQueryMyTransactions {
  return {
    type: Actions.QUERY_MY_TRANSACTION_REQUESTS,
    userAction,
    statuses,
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
