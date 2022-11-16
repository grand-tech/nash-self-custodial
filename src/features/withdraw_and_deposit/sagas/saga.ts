import {Contract} from 'web3-eth-contract';
import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {Actions} from '../redux_store/action.patterns';
import {
  generateActionSetPendingTransactions,
  generateActionSetMyTransactions,
  generateActionQueryMyTransactions,
} from '../redux_store/action.generators';
import ReadContractDataKit from './ReadContractDataKit';
import {NashEscrowTransaction, TransactionType} from './nash_escrow_types';
import {
  ActionQueryPendingTransactions,
  ActionMakeRampRequest,
  ActionAgentFulfillRequest,
} from '../redux_store/actions';
import NashContractKit from '../../account_balance/contract.kit.utils';
import {
  generateActionSetSuccess,
  generateActionSetError,
} from '../../ui_state_manager/action.generators';
import {getStoredPrivateKey} from '../../onboarding/utils';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {NashCache} from '../../../utils/cache';
import {
  selectRampMyTransactions,
  selectRampPendingTransactions,
} from '../redux_store/selectors';
import {
  ActionQueryMyTransactions,
  ActionCancelTransaction,
} from '../redux_store/actions';

/**
 * Query the list of pending transactions in the smart contract.
 * @param _action the action with the required payload.
 */
export function* queryPendingTransactionsSaga(
  _action: ActionQueryPendingTransactions,
) {
  const kit = ReadContractDataKit.getInstance();

  if (_action.userAction === 'refetch') {
    NashCache.setRampPaginator(NashCache.DEFAULT_RAMP_PAGINATOR_VALUE);
  }

  if (typeof kit !== 'undefined') {
    const transactions: NashEscrowTransaction[] = yield call(
      kit.fetchTransactions,
    );

    if (_action.userAction === 'refetch') {
      yield put(generateActionSetPendingTransactions(transactions));
    } else {
      const txs: NashEscrowTransaction[] = yield select(
        selectRampPendingTransactions,
      );

      yield put(generateActionSetPendingTransactions(transactions.concat(txs)));
    }
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
 * Query the list of pending transactions in the smart contract.
 * @param _action the action with the required payload.
 */
export function* queryMyTransactionsSaga(_action: ActionQueryMyTransactions) {
  const kit = ReadContractDataKit.getInstance();

  if (_action.userAction === 'refetch') {
    NashCache.setMyTransactionsRampPaginator(
      NashCache.DEFAULT_RAMP_PAGINATOR_VALUE,
    );
  }

  const address: string = yield select(selectPublicAddress);
  if (typeof kit !== 'undefined') {
    const transactions: NashEscrowTransaction[] = yield call(
      kit.fetchMyTransactions,
      _action.statuses,
      address,
    );

    if (_action.userAction === 'refetch') {
      yield put(generateActionSetMyTransactions(transactions));
    } else {
      const txs: NashEscrowTransaction[] = yield select(
        selectRampMyTransactions,
      );

      yield put(generateActionSetMyTransactions(transactions.concat(txs)));
    }
  }
}

/**
 * Listens fot the action requesting for the list
 *  of pending transactions and performs the necessary logic.
 */
export function* watchQueryMyTransactionsSaga() {
  yield takeLatest(
    Actions.QUERY_MY_TRANSACTION_REQUESTS,
    queryMyTransactionsSaga,
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
    // const receipt: any =
    yield call(NashContractKit.sendTransactionObject, tx, address);

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
    return contract?.methods.initializeDepositTransaction(amount, '');
  } else {
    return contract?.methods.initializeWithdrawalTransaction(amount, '');
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

export function* agentFullfilRequestSaga(_action: ActionAgentFulfillRequest) {
  try {
    const transaction = _action.transaction;
    const contractKit: NashContractKit = yield call(
      NashContractKit.getInstance,
    );
    const contract = contractKit.getNashEscrow();

    const privateKey: string = yield call(getStoredPrivateKey, _action.pin);
    contractKit.kit?.addAccount(privateKey);

    const address: string = yield select(selectPublicAddress);

    yield call(
      NashContractKit.cUSDApproveAmount,
      transaction.grossAmount,
      address,
    );

    const tsxObj = generateAgentFulfillRequestTransactionObject(
      transaction,
      contract,
    );

    yield call(NashContractKit.sendTransactionObject, tsxObj, address);

    yield call(NashContractKit.cUSDApproveAmount, 0, address);

    yield put(generateActionSetSuccess('Accepted transaction.'));

    yield put(generateActionQueryBalance());
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    yield put(generateActionSetError(error.message, error.message));
  }
}

/**
 * Generates the transaction object to be sent.
 * @param transaction the transaction type.
 * @param contract the instance of the escrow smart contract.
 * @returns the composed transaction type.
 */
function generateAgentFulfillRequestTransactionObject(
  transaction: NashEscrowTransaction,
  contract: Contract,
) {
  const transactionType = transaction.txType;

  if (transactionType === TransactionType.DEPOSIT) {
    return contract?.methods.agentAcceptDepositTransaction(
      transaction.id,
      '+254791725651',
    );
  } else {
    return contract?.methods.agentAcceptWithdrawalTransaction(
      transaction.id,
      '+254791725651',
    );
  }
}

export function* watchAgentFullfilRequestSaga() {
  yield takeLatest(Actions.AGENT_FULFILL_REQUEST, agentFullfilRequestSaga);
}

export function* cancelRequestSaga(_action: ActionCancelTransaction) {
  console.log('======', _action);

  try {
    // const transaction = _action.transaction;
    // const contractKit: NashContractKit = yield call(
    //   NashContractKit.getInstance,
    // );
    // const contract = contractKit.getNashEscrow();

    // const privateKey: string = yield call(getStoredPrivateKey, _action.pin);
    // contractKit.kit?.addAccount(privateKey);

    // const address: string = yield select(selectPublicAddress);

    // const tsxObj = contract?.methods.agentAcceptDepositTransaction(
    //   transaction.id,
    //   '+254791725651',
    // );

    // yield call(NashContractKit.sendTransactionObject, tsxObj, address);

    yield put(generateActionSetSuccess('Accepted transaction.'));

    yield put(generateActionQueryBalance());
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    yield put(generateActionSetError(error.message, error.message));
  }
}

/**
 * Generates the transaction object to be sent.
 * @param transaction the transaction type.
 * @param contract the instance of the escrow smart contract.
 * @returns the composed transaction type.
 */
function generateCancelRequestTransaction(
  transaction: NashEscrowTransaction,
  publicAddress: string,
  contract: Contract,
) {
  if (transaction.clientAddress === publicAddress) {
    return contract?.methods.clientConfirmPayment(transaction.id);
  } else {
    return contract?.methods.agentConfirmPayment(transaction.id);
  }
}

export function* watchCancelRequestSaga() {
  yield takeLatest(Actions.CANCEL_TRANSACTION, cancelRequestSaga);
}

export function* approveTransactionSaga(_action: ActionCancelTransaction) {
  try {
    const contractKit: NashContractKit = yield call(
      NashContractKit.getInstance,
    );
    const contract = contractKit.getNashEscrow();

    const privateKey: string = yield call(getStoredPrivateKey, _action.pin);
    contractKit.kit?.addAccount(privateKey);

    const address: string = yield select(selectPublicAddress);

    const tsxObj = generateCancelRequestTransaction(
      _action.transaction,
      address,
      contract,
    );

    yield call(NashContractKit.sendTransactionObject, tsxObj, address);

    yield put(generateActionSetSuccess('Approved transaction.'));

    yield put(generateActionQueryBalance());
    yield put(generateActionQueryMyTransactions('refetch', [0, 1, 2]));
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    yield put(generateActionSetError(error.message, error.message));
  }
}

export function* watchApproveTransactionSaga() {
  yield takeLatest(Actions.APPROVE_TRANSACTION, approveTransactionSaga);
}

export function* onRampOffRampSaga() {
  yield spawn(watchQueryPendingTransactionsSaga);
  yield spawn(watchMakeRampExchangeRequestSaga);
  yield spawn(watchAgentFullfilRequestSaga);
  yield spawn(watchQueryMyTransactionsSaga);
  yield spawn(watchAgentFullfilRequestSaga);
  yield spawn(watchApproveTransactionSaga);
}
