import {BigNumber} from 'bignumber.js';
import {Contract} from 'web3-eth-contract';
import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {Actions} from '../redux_store/action.patterns';
import {generateActionSetPendingTransactions} from '../redux_store/action.generators';
import ReadContractDataKit from './ReadContractDataKit';
import {NashEscrowTransaction, TransactionType} from './nash_escrow_types';
import {
  ActionQueryPendingTransactions,
  ActionMakeRampRequest,
} from '../redux_store/actions';
import NashContractKit from '../../account_balance/contract.kit.utils';
import {
  generateActionSetSuccess,
  generateActionSetError,
} from '../../ui_state_manager/action.generators';
import {getStoredPrivateKey} from '../../onboarding/utils';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';

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
 * @param _action contains input required to make the request to the smart contract.
 */
export function* makeRampExchangeRequestSaga(_action: ActionMakeRampRequest) {
  try {
    const contractKit: NashContractKit = yield call(
      NashContractKit.getInstance,
    );
    const contract = contractKit.getNashEscrow();

    const privateKey: string = yield call(getStoredPrivateKey, _action.pin);
    contractKit.kit?.addAccount(privateKey);

    const address: string = yield select(selectPublicAddress);

    const amount =
      contractKit.kit?.web3.utils.toWei(_action.amount.toString()) ?? '';

    const tx = generateInitTransactionObject(
      amount.toString(),
      _action.transactionType,
      contract,
    );
    // TODO: Figure out what to do with the boolean result
    yield call(NashContractKit.cUSDApproveAmount, _action.amount, address);

    // TODO: figure out what to do with the receipt.
    const receipt: any = yield call(
      NashContractKit.sendTransactionObject,
      tx,
      address,
    );

    yield call(NashContractKit.cUSDApproveAmount, 0, address);

    yield put(generateActionSetSuccess('Initialized transaction.'));

    // TODO: move this to event listeners.
    yield put(generateActionQueryBalance());
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    yield put(generateActionSetError(error.message, error.message));
  }
}

/**
 * Generates the transaction object to be sent.
 * @param amount the amount involved in the transaction.
 * @param transactionType the transaction type.
 * @param contract the instance of the escrow smart contract.
 * @returns the composed transaction type.
 */
function generateInitTransactionObject(
  amount: string,
  transactionType: TransactionType,
  contract: Contract,
) {
  if (transactionType === TransactionType.DEPOSIT) {
    return contract?.methods.initializeDepositTransaction(amount, 'KES', '');
  } else {
    return contract?.methods.initializeWithdrawalTransaction(amount, 'KES', '');
  }
}

/**
 * Listens for the make deposit request action and calls the relevant function.
 */
export function* watchMakeRampExchangeRequestSaga() {
  yield takeLatest(
    Actions.MAKE_RAMP_EXCHANGE_REQUEST,
    makeRampExchangeRequestSaga,
  );
}

export function* onRampOffRampSaga() {
  yield spawn(watchQueryPendingTransactionsSaga);
  yield spawn(watchMakeRampExchangeRequestSaga);
}
