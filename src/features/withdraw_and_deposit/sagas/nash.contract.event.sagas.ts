import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {Actions} from '../redux_store/action.patterns';
import {ActionTransactionInitializationContractEvent} from '../redux_store/actions';
import {updatePendingTransactionsList} from './saga';
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

export function* onRampOffRampSagas() {
  yield spawn(watchTransactionInitializationEvent);
}
