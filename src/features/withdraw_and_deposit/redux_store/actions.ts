import {Actions} from './action.patterns';
import {StableToken} from '@celo/contractkit';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';
import {ActionLogOut} from '../../../app-redux-store/global_redux_actions/actions';

export type ListUpdateActions = 'update' | 'remove' | 'add';

export type QueryTransactionsUserActions = 'refetch' | 'fetch-more';

export type DataQueryTriggers = 'ui' | 'background';

export interface ActionQueryPendingTransactions {
  type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS;
  userAction: QueryTransactionsUserActions;
  trigger: DataQueryTriggers;
}

export interface ActionQueryMyTransactions {
  type: Actions.QUERY_MY_TRANSACTION_REQUESTS;
  userAction: QueryTransactionsUserActions;
  statuses: number[];
  trigger: DataQueryTriggers;
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

export interface ActionApproveTransaction {
  type: Actions.APPROVE_TRANSACTION;
  transaction: NashEscrowTransaction;
  pin: string;
}

export interface ActionCancelTransaction {
  type: Actions.CANCEL_TRANSACTION;
  transaction: NashEscrowTransaction;
  pin: string;
}

export interface ActionUpdatePendingTransaction {
  type: Actions.UPDATE_PENDING_TRANSACTION_LISTS;
  transaction: NashEscrowTransaction;
  action: ListUpdateActions;
}

export interface ActionUpdateMyTransaction {
  type: Actions.UPDATE_MY_TRANSACTION_LISTS;
  transaction: NashEscrowTransaction;
  action: ListUpdateActions;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionLogOut //should be at the beginning of all reducers.
  | ActionQueryPendingTransactions
  | ActionSetPendingTransactions
  | ActionAgentFulfillRequest
  | ActionSetMyTransactions
  | ActionApproveTransaction
  | ActionCancelTransaction
  | ActionUpdatePendingTransaction
  | ActionUpdateMyTransaction;
