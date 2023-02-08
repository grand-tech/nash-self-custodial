import {Actions} from './action.patterns';
import {StableToken} from '@celo/contractkit';
import {
  NashEscrowTransaction,
  TransactionType,
} from '../sagas/nash_escrow_types';
import {ActionLogOut} from '../../../app-redux-store/global_redux_actions/actions';
import {
  DataQueryTriggers,
  ListUpdateActions,
  QueryTransactionsUserActions,
} from './enums';

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

// Smart contract event actions.
export interface ActionTransactionInitializationContractEvent {
  type: Actions.TRANSACTION_INIT_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionAgentPairingContractEvent {
  type: Actions.AGENT_PAIRING_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionClientConfirmationContractEvent {
  type: Actions.CLIENT_CONFIRMATION_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionAgentConfirmationContractEvent {
  type: Actions.AGENT_CONFIRMATION_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionSavedClientCommentContractEvent {
  type: Actions.SAVED_CLIENT_PAYMENT_INFORMATION_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionConfirmationCompletedContractEvent {
  type: Actions.CONFIRMATION_COMPLETE_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionTransactionCompletionEvent {
  type: Actions.TRANSACTION_COMPLETE_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
}

export interface ActionTransactionCanceledContractEvent {
  type: Actions.TRANSACTION_CANCELED_CONTRACT_EVENT;
  transaction: NashEscrowTransaction;
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
  | ActionTransactionInitializationContractEvent
  | ActionAgentPairingContractEvent
  | ActionClientConfirmationContractEvent
  | ActionAgentConfirmationContractEvent
  | ActionSavedClientCommentContractEvent
  | ActionConfirmationCompletedContractEvent
  | ActionTransactionCompletionEvent
  | ActionTransactionCanceledContractEvent;
