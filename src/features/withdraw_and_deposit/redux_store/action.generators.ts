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
  ActionAgentFulfillRequest,
  ActionMakeRampRequest,
  ActionQueryPendingTransactions,
  ActionSetPendingTransactions,
  ActionTransactionInitializationContractEvent,
  ActionAgentConfirmationContractEvent,
  ActionAgentPairingContractEvent,
  ActionClientConfirmationContractEvent,
  ActionConfirmationCompletedContractEvent,
  ActionSavedClientCommentContractEvent,
  ActionTransactionCanceledContractEvent,
  ActionTransactionCompletionEvent,
  ActionUpdateSelectedTransaction,
  ActionRefetchSelectedTransaction,
} from './actions';
import {DataQueryTriggers, QueryTransactionsUserActions} from './enums';

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

export function generateActionTransactionInitializationContractEvent(
  transaction: NashEscrowTransaction,
): ActionTransactionInitializationContractEvent {
  return {
    type: Actions.TRANSACTION_INIT_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionAgentPairingContractEvent(
  transaction: NashEscrowTransaction,
): ActionAgentPairingContractEvent {
  return {
    type: Actions.AGENT_PAIRING_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionClientConfirmationContractEvent(
  transaction: NashEscrowTransaction,
): ActionClientConfirmationContractEvent {
  return {
    type: Actions.CLIENT_CONFIRMATION_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionAgentConfirmationContractEvent(
  transaction: NashEscrowTransaction,
): ActionAgentConfirmationContractEvent {
  return {
    type: Actions.AGENT_CONFIRMATION_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionSavedClientCommentContractEvent(
  transaction: NashEscrowTransaction,
): ActionSavedClientCommentContractEvent {
  return {
    type: Actions.SAVED_CLIENT_PAYMENT_INFORMATION_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionConfirmationCompletedContractEvent(
  transaction: NashEscrowTransaction,
): ActionConfirmationCompletedContractEvent {
  return {
    type: Actions.CONFIRMATION_COMPLETE_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionTransactionCompletionEvent(
  transaction: NashEscrowTransaction,
): ActionTransactionCompletionEvent {
  return {
    type: Actions.TRANSACTION_COMPLETE_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionTransactionCanceledContractEvent(
  transaction: NashEscrowTransaction,
): ActionTransactionCanceledContractEvent {
  return {
    type: Actions.TRANSACTION_CANCELED_CONTRACT_EVENT,
    transaction,
  };
}

export function generateActionUpdateSelectedTransaction(
  transaction?: NashEscrowTransaction,
): ActionUpdateSelectedTransaction {
  return {
    type: Actions.UPDATE_SELECTED_TRANSACTION,
    transaction,
  };
}

export function generateActionRefetchTransaction(
  transaction: NashEscrowTransaction,
): ActionRefetchSelectedTransaction {
  return {
    type: Actions.REFETCH_SELECTED_TRANSACTION,
    transaction: transaction,
  };
}
