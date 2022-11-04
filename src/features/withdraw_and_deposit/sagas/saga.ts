import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import {Actions} from '../redux_store/action.patterns';
import {ActionQueryPendingTransactions} from '../redux_store/actions';
import {generateActionSetPendingTransactions} from '../redux_store/action.generators';
import ReadContractDataKit from './ReadContractDataKit';
import {NashEscrowTransaction} from './nash_escrow_types';
import {
  ActionMakeWithdrawalRequest,
  ActionMakeDepositRequest,
} from '../redux_store/actions';

/**
 * Query the list of pending transactions in the smart contract.
 * @param _action the action with the required payload.
 */
export function* queryPendingTransactionsSaga(
  _action: ActionQueryPendingTransactions,
) {
  const kit = ReadContractDataKit.getInstance();

  if (typeof kit !== 'undefined') {
    const transactions: NashEscrowTransaction[] = yield call(
      kit.fetchTransactions,
    );
    yield put(generateActionSetPendingTransactions(transactions));
  }
}

/**
 * Listens fot the action requesting for the list
 *  of pending transactions and performs the necessary logic.
 */
export function* watchQueryPendingTransactionsSaga() {
  yield takeLatest(
    Actions.QUERY_PENDING_TRANSACTION_REQUESTS,
    queryPendingTransactionsSaga,
  );
}

/**
 * Makes a deposit request to the escrow smart contract.
 * @param action contains input required to make the request to the smart contract.
 */
export function* makeDepositRequestSaga(action: ActionMakeDepositRequest) {
  console.log('===================>', action);
}

/**
 * Listens for the make deposit request action and calls the relevant function.
 */
export function* watchMakeDepositRequestSaga() {
  yield takeLatest(Actions.MAKE_DEPOSIT_REQUEST, makeDepositRequestSaga);
}

/**
 * Makes a withdrawal request to the smart contract.
 * @param action the list of necessary input fields required to make a withdrawal request.
 */
export function* makeWithdrawalRequestSaga(
  action: ActionMakeWithdrawalRequest,
) {
  console.log('===================>', action);
}

/**
 * Listens for the relevant action required to create a withdrawal transaction.
 */
export function* watchMakeWithdrawalRequestSaga() {
  yield takeLatest(Actions.MAKE_WITHDRAWAL_REQUEST, makeWithdrawalRequestSaga);
}

export function* onRampOffRampSaga() {
  yield spawn(watchQueryPendingTransactionsSaga);
  yield spawn(watchMakeDepositRequestSaga);
  yield spawn(watchMakeWithdrawalRequestSaga);
}
