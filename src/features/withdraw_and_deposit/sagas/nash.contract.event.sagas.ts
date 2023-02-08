import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {generateActionAddClientPaymentInfoToTx} from '../../comment_encryption/redux_store/action.generators';
import {ActionAddClientsPaymentInfoToTransaction} from '../../comment_encryption/redux_store/actions';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {Actions} from '../redux_store/action.patterns';
import {
  ActionAgentConfirmationContractEvent,
  ActionAgentPairingContractEvent,
  ActionClientConfirmationContractEvent,
  ActionConfirmationCompletedContractEvent,
  ActionTransactionCanceledContractEvent,
  ActionTransactionInitializationContractEvent,
} from '../redux_store/actions';
import {updateMyTransactionsList, updatePendingTransactionsList} from './saga';

/**
 * Does the necessary updates incase the smart
 *  contract emits a transaction initialization event.
 * @param _action the action.
 */
export function* handleTransactionInitializationEvent(
  _action: ActionTransactionInitializationContractEvent,
) {
  const myAddress: string = yield select(selectPublicAddress);
  if (_action.transaction.clientAddress === myAddress) {
    yield put(generateActionQueryBalance());
    yield call(updateMyTransactionsList, 'add', _action.transaction);
  } else {
    yield call(updatePendingTransactionsList, 'add', _action.transaction);
  }
}

/**
 * Listens for the transaction initialization
 * event from the smart contract.
 */
export function* watchTransactionInitializationEvent() {
  yield takeLatest(
    Actions.TRANSACTION_INIT_CONTRACT_EVENT,
    handleTransactionInitializationEvent,
  );
}

/**
 * Does the necessary updates incase the smart
 *  contract emits an agent paired event.
 * @param _action the action.
 */
export function* handleAgentPairingEvent(
  _action: ActionAgentPairingContractEvent,
) {
  const myAddress: string = yield select(selectPublicAddress);
  if (_action.transaction.clientAddress === myAddress) {
    yield put(generateActionAddClientPaymentInfoToTx(_action.transaction));
    yield call(updateMyTransactionsList, 'update', _action.transaction);
  } else {
    yield call(updatePendingTransactionsList, 'remove', _action.transaction);
  }

  if (_action.transaction.agentAddress === myAddress) {
    yield call(updateMyTransactionsList, 'add', _action.transaction);
    yield put(generateActionQueryBalance());
  }
}

/**
 * Listens for the transaction agent accepted transaction
 * event from the smart contract.
 */
export function* watchAgentPairingEvent() {
  yield takeLatest(
    Actions.AGENT_PAIRING_CONTRACT_EVENT,
    handleAgentPairingEvent,
  );
}

/**
 * Does the necessary updates incase the smart
 *  contract emits a intermediate transaction events.
 * @param _action the action.
 */
export function* handleClientConfirmationEvent(
  _action:
    | ActionAgentConfirmationContractEvent
    | ActionClientConfirmationContractEvent
    | ActionAddClientsPaymentInfoToTransaction
    | ActionConfirmationCompletedContractEvent,
) {
  const myAddress: string = yield select(selectPublicAddress);
  if (
    _action.transaction.clientAddress === myAddress ||
    _action.transaction.agentAddress === myAddress
  ) {
    yield call(updateMyTransactionsList, 'update', _action.transaction);
  }
}

/**
 * Listens for the (client confirmed transaction)
 * event from the smart contract.
 */
export function* watchClientConfirmationEvent() {
  yield takeLatest(
    Actions.CLIENT_CONFIRMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Listens for the (agent confirmed transaction)
 * event from the smart contract.
 */
export function* watchAgentConfirmationEvent() {
  yield takeLatest(
    Actions.AGENT_CONFIRMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Listens for the (client save payment information)
 * event from the smart contract.
 */
export function* watchClientSavedPaymentInformationEvent() {
  yield takeLatest(
    Actions.SAVED_CLIENT_PAYMENT_INFORMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Listens for the (confirmation completed)
 * event from the smart contract.
 */
export function* watchConfirmationCompleteEvent() {
  yield takeLatest(
    Actions.CONFIRMATION_COMPLETE_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Does the necessary updates incase the smart
 *  contract emits a transaction canceled event.
 * @param _action the action.
 */
export function* handleTransactionCanceledEvent(
  _action: ActionTransactionCanceledContractEvent,
) {
  const myAddress: string = yield select(selectPublicAddress);
  if (_action.transaction.clientAddress === myAddress) {
    yield call(updateMyTransactionsList, 'remove', _action.transaction);
    yield put(generateActionQueryBalance());
  } else {
    yield call(updatePendingTransactionsList, 'remove', _action.transaction);
  }
}

/**
 * Listens for the transaction canceled
 * event from the smart contract.
 */
export function* watchTransactionCanceledEvent() {
  yield takeLatest(
    Actions.TRANSACTION_CANCELED_CONTRACT_EVENT,
    handleTransactionCanceledEvent,
  );
}

/**
 * Does the necessary updates incase the smart
 *  contract emits a transaction completed event.
 * @param _action the action.
 */
export function* handleTransactionCompletedEvent(
  _action: ActionConfirmationCompletedContractEvent,
) {
  const myAddress: string = yield select(selectPublicAddress);
  if (
    _action.transaction.clientAddress === myAddress ||
    _action.transaction.agentAddress === myAddress
  ) {
    yield call(updatePendingTransactionsList, 'remove', _action.transaction);
    yield put(generateActionQueryBalance());
  }
}

/**
 * Listens for the transaction completed
 * event from the smart contract.
 */
export function* watchTransactionCompletedEvent() {
  yield takeLatest(
    Actions.TRANSACTION_CANCELED_CONTRACT_EVENT,
    handleTransactionCompletedEvent,
  );
}

export function* rampEscrowContractEventListenerSagas() {
  yield spawn(watchTransactionInitializationEvent);
  yield spawn(watchAgentPairingEvent);
  yield spawn(watchClientConfirmationEvent);
  yield spawn(watchAgentConfirmationEvent);
  yield spawn(watchClientSavedPaymentInformationEvent);
  yield spawn(watchConfirmationCompleteEvent);
  yield spawn(watchTransactionCanceledEvent);
}
