import {Actions} from './action.patterns';
import {ActionMakeWithdrawalRequest} from './actions';
import {NashEscrowTransaction} from '../sagas/nash_escrow_types';
import {
  ActionMakeDepositRequest,
  ActionQueryPendingTransactions,
  ActionSetPendingTransactions,
} from './actions';

export function generateActionQueryPendingTransactions(): ActionQueryPendingTransactions {
  return {
    type: Actions.QUERY_PENDING_TRANSACTION_REQUESTS,
  };
}

export function generateActionSetPendingTransactions(
  transactions: Array<NashEscrowTransaction>,
): ActionSetPendingTransactions {
  return {
    type: Actions.SET_PENDING_TRANSACTION_LISTS,
    pending_transactions: transactions,
  };
}

export function generateActionMakeDepositRequest(): ActionMakeDepositRequest {
  return {
    type: Actions.MAKE_DEPOSIT_REQUEST,
  };
}

export function generateActionMakeWithdrawalRequest(): ActionMakeWithdrawalRequest {
  return {
    type: Actions.MAKE_WITHDRAWAL_REQUEST,
  };
}
