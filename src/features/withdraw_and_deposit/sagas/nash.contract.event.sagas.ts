import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {generateActionAddClientPaymentInfoToTx} from '../../comment_encryption/redux_store/action.generators';
import {ActionAddClientsPaymentInfoToTransaction} from '../../comment_encryption/redux_store/actions';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {generateActionUpdatePendingTransactions} from '../redux_store/action.generators';
import {Actions} from '../redux_store/action.patterns';
import {
  ActionAgentConfirmationContractEvent,
  ActionAgentPairingContractEvent,
  ActionClientConfirmationContractEvent,
  ActionConfirmationCompletedContractEvent,
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
  if (_action.transaction.clientAddress !== myAddress) {
    yield call(updatePendingTransactionsList, 'add', _action.transaction);
  }

  if (
    _action.transaction.clientAddress === myAddress ||
    _action.transaction.agentAddress === myAddress
  ) {
    yield put(generateActionQueryBalance());
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
 *  contract emits a transaction initialization event.
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
    yield call(updateMyTransactionsList, 'add', _action.transaction);
  }

  yield call(updatePendingTransactionsList, 'remove', _action.transaction);

  if (
    _action.transaction.clientAddress === myAddress ||
    _action.transaction.agentAddress === myAddress
  ) {
    yield put(generateActionQueryBalance());
  }
}

/**
 * Listens for the transaction initialization
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
 *  contract emits a transaction initialization event.
 * @param _action the action.
 */
export function* handleClientConfirmationEvent(
  _action:
    | ActionAgentConfirmationContractEvent
    | ActionClientConfirmationContractEvent
    | ActionAddClientsPaymentInfoToTransaction
    | ActionConfirmationCompletedContractEvent,
) {
  yield call(updateMyTransactionsList, 'update', _action.transaction);
}

/**
 * Listens for the transaction initialization
 * event from the smart contract.
 */
export function* watchClientConfirmationEvent() {
  yield takeLatest(
    Actions.CLIENT_CONFIRMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Listens for the transaction initialization
 * event from the smart contract.
 */
export function* watchAgentConfirmationEvent() {
  yield takeLatest(
    Actions.AGENT_CONFIRMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Listens for the transaction initialization
 * event from the smart contract.
 */
export function* watchClientSavedPaymentInformationEvent() {
  yield takeLatest(
    Actions.AGENT_CONFIRMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

/**
 * Listens for the transaction initialization
 * event from the smart contract.
 */
export function* watchConfirmationCompleteEvent() {
  yield takeLatest(
    Actions.AGENT_CONFIRMATION_CONTRACT_EVENT,
    handleClientConfirmationEvent,
  );
}

export function* onRampOffRampSagas() {
  yield spawn(watchTransactionInitializationEvent);
  yield spawn(watchAgentPairingEvent);
  yield spawn(watchClientConfirmationEvent);
  yield spawn(watchAgentConfirmationEvent);
  yield spawn(watchClientSavedPaymentInformationEvent);
  yield spawn(watchConfirmationCompleteEvent);
}
