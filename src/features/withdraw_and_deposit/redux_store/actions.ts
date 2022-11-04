import {Actions} from './action.patterns';
import {NashEscrowTransaction} from '../sagas/nash_escrow_types';

export interface ActionQueryPendingTransactions {
  type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS;
}

export interface ActionSetPendingTransactions {
  type: Actions.SET_PENDING_TRANSACTION_LISTS;
  pending_transactions: Array<NashEscrowTransaction>;
}

export interface ActionMakeDepositRequest {
  type: Actions.MAKE_DEPOSIT_REQUEST;
}

export interface ActionMakeWithdrawalRequest {
  type: Actions.MAKE_WITHDRAWAL_REQUEST;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionQueryPendingTransactions
  | ActionSetPendingTransactions
  | ActionMakeDepositRequest
  | ActionMakeWithdrawalRequest;
