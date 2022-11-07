import {Actions} from './action.patterns';
import {StableToken} from '@celo/contractkit';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';

export interface ActionQueryPendingTransactions {
  type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS;
}

export interface ActionSetPendingTransactions {
  type: Actions.SET_PENDING_TRANSACTION_LISTS;
  pending_transactions: Array<NashEscrowTransaction>;
}

export interface ActionMakeRampRequest {
  type: Actions.MAKE_RAMP_EXCHANGE_REQUEST;
  transactionType: TransactionType;
  amount: number;
  coin: StableToken;
  pin: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionQueryPendingTransactions
  | ActionSetPendingTransactions;
