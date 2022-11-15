import {Actions} from './action.patterns';
import {StableToken} from '@celo/contractkit';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';

export type QueryTransactionsUserActions = 'refetch' | 'fetch-more';

export interface ActionQueryPendingTransactions {
  type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS;
  userAction: QueryTransactionsUserActions;
}

export interface ActionQueryMyTransactions {
  type: Actions.QUERY_MY_TRANSACTION_REQUESTS;
  userAction: QueryTransactionsUserActions;
  statuses: number[];
}

export interface ActionSetPendingTransactions {
  type: Actions.SET_PENDING_TRANSACTION_LISTS;
  transactions: Array<NashEscrowTransaction>;
}

export interface ActionSetMyTransactions {
  type: Actions.SET_MY_TRANSACTION_LISTS;
  transactions: Array<NashEscrowTransaction>;
}

export interface ActionMakeRampRequest {
  type: Actions.MAKE_RAMP_EXCHANGE_REQUEST;
  transactionType: TransactionType;
  amount: number;
  coin: StableToken;
  pin: string;
}

export interface ActionAgentFulfillRequest {
  type: Actions.AGENT_FULFILL_REQUEST;
  transaction: NashEscrowTransaction;
  pin: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionQueryPendingTransactions
  | ActionSetPendingTransactions
  | ActionAgentFulfillRequest
  | ActionSetMyTransactions;
