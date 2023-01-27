import {
  call,
  put,
  select,
  spawn,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
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
  ActionUpdateMyTransaction,
  ActionUpdatePendingTransaction,
} from '../redux_store/actions';
import {
  contractKit,
  stableTokenApproveAmount,
  sendTransactionObject,
  web3,
} from '../../account_balance/contract.kit.utils';
import {
  generateActionSetSuccess,
  generateActionSetError,
} from '../../ui_state_manager/action.generators';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {NashCache} from '../../../utils/cache';
import {ListUpdateActions} from '../redux_store/actions';
import {nashEscrow} from '../../account_balance/contract.kit.utils';
import {
  selectRampMyTransactions,
  selectRampPendingTransactions,
} from '../redux_store/selectors';
import {
  ActionQueryMyTransactions,
  ActionCancelTransaction,
} from '../redux_store/actions';
import {encryptEscrowComment} from '../../comment_encryption/sagas/saga';
import {StableToken} from '@celo/contractkit';
import {CeloTxObject} from '@celo/connect';
import {newStableToken} from '@celo/contractkit/lib/generated/StableToken';
import {StableTokenWrapper} from '@celo/contractkit/lib/wrappers/StableTokenWrapper';
import crashlytics from '@react-native-firebase/crashlytics';

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
    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);

    const address: string = yield select(selectPublicAddress);

    const amount = contractKit.web3.utils.toWei(_action.amount.toString());

    const tokenContract: StableTokenWrapper = yield call(
      [contractKit.contracts, contractKit.contracts.getStableToken],
      _action.coin,
    );

    const tx: CeloTxObject<any> = yield call(
      generateInitTransactionObject,
      amount.toString(),
      _action.transactionType,
      tokenContract.address,
    );
    // TODO: Figure out what to do with the boolean result
    yield call(stableTokenApproveAmount, _action.coin, _action.amount, address);

    // TODO: figure out what to do with the receipt.
    // const receipt: any =
    yield call(sendTransactionObject, tx, address, tokenContract.address);

    yield call(stableTokenApproveAmount, _action.coin, 0, address);

    yield put(generateActionSetSuccess('Initialized transaction.'));

    // TODO: move this to event listeners.
    yield put(generateActionQueryBalance());
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    crashlytics().recordError(
      new Error(error),
      '[SAGA] makeRampExchangeRequestSaga: ' + error.name,
    );
    yield put(generateActionSetError(error.message, error.message));
  }
}

/**
 * Generates the transaction object to be sent.
 * @param amount the amount involved in the transaction.
 * @param transactionType the transaction type.
 * @returns the composed transaction type.
 */
async function generateInitTransactionObject(
  amount: string,
  transactionType: TransactionType,
  coinAddress: String,
) {
  if (transactionType === TransactionType.DEPOSIT) {
    return nashEscrow.methods.initializeDepositTransaction(amount, coinAddress);
  } else {
    return nashEscrow.methods.initializeWithdrawalTransaction(
      amount,
      coinAddress,
    );
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

    const stableTokenContract = newStableToken(
      web3,
      transaction.enxchangeToken,
    );
    const n = stableTokenContract.methods.symbol();
    const symbol: string = yield call(n.call);

    var stableToken: StableToken = (<any>StableToken)[symbol];

    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);
    const address: string = yield select(selectPublicAddress);
    yield call(
      stableTokenApproveAmount,
      stableToken,
      transaction.grossAmount,
      address,
    );
    const paymentInfoCypherText: string = yield call(
      encryptEscrowComment,
      transaction.clientAddress,
      transaction.agentAddress,
    );
    const tsxObj = generateAgentFulfillRequestTransactionObject(
      transaction,
      paymentInfoCypherText,
    );

    yield call(
      sendTransactionObject,
      tsxObj,
      address,
      transaction.enxchangeToken,
    );
    yield call(stableTokenApproveAmount, stableToken, 0, address);
    yield put(generateActionSetSuccess('Accepted transaction.'));
    yield put(generateActionQueryBalance());
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    crashlytics().recordError(
      new Error(error),
      '[SAGA] agentFullfilRequestSaga: ' + error.name,
    );
    yield put(generateActionSetError(error.message, error.message));
  }
}

/**
 * Generates the transaction object to be sent.
 * @param transaction the transaction type.
 * @param paymentInfoCypherText encrypted payment information.
 * @returns the composed transaction type.
 */
function generateAgentFulfillRequestTransactionObject(
  transaction: NashEscrowTransaction,
  paymentInfoCypherText: string,
) {
  const transactionType = transaction.txType;

  if (transactionType === TransactionType.DEPOSIT) {
    return nashEscrow.methods.agentAcceptDepositTransaction(
      transaction.id,
      paymentInfoCypherText,
    );
  } else {
    return nashEscrow.methods.agentAcceptWithdrawalTransaction(
      transaction.id,
      paymentInfoCypherText,
    );
  }
}

export function* watchAgentFullfilRequestSaga() {
  yield takeLatest(Actions.AGENT_FULFILL_REQUEST, agentFullfilRequestSaga);
}

export function* cancelRequestSaga(_action: ActionCancelTransaction) {
  try {
    yield put(generateActionSetSuccess('Accepted transaction.'));

    yield put(generateActionQueryBalance());
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    crashlytics().recordError(
      new Error(error),
      '[SAGA] cancelRequestSaga: ' + error.name,
    );
    yield put(generateActionSetError(error.message, error.message));
  }
}

/**
 * Generates the transaction object to be sent.
 * @param transaction the transaction type.
 * @returns the composed transaction type.
 */
function generateCancelRequestTransaction(
  transaction: NashEscrowTransaction,
  publicAddress: string,
) {
  if (transaction.clientAddress === publicAddress) {
    return nashEscrow.methods.clientConfirmPayment(transaction.id);
  } else {
    return nashEscrow.methods.agentConfirmPayment(transaction.id);
  }
}

export function* watchCancelRequestSaga() {
  yield takeLatest(Actions.CANCEL_TRANSACTION, cancelRequestSaga);
}

export function* approveTransactionSaga(_action: ActionCancelTransaction) {
  try {
    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);

    const address: string = yield select(selectPublicAddress);

    const tsxObj = generateCancelRequestTransaction(
      _action.transaction,
      address,
    );

    yield call(
      sendTransactionObject,
      tsxObj,
      address,
      _action.transaction.enxchangeToken,
    );

    yield put(generateActionSetSuccess('Approved transaction.'));

    yield put(generateActionQueryBalance());
    yield put(generateActionQueryMyTransactions('refetch', [0, 1, 2]));
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error', error);
    crashlytics().recordError(
      new Error(error),
      '[SAGA] approveTransactionSaga: ' + error.name,
    );
    yield put(generateActionSetError(error.message, error.message));
  }
}

export function* watchApproveTransactionSaga() {
  yield takeLatest(Actions.APPROVE_TRANSACTION, approveTransactionSaga);
}

export function* updateMyTransactionsListSaga(
  _action: ActionUpdateMyTransaction,
) {
  const txs: NashEscrowTransaction[] = yield select(selectRampMyTransactions);
  const update = generateUpdatedList(_action.action, _action.transaction, txs);
  yield put(generateActionSetMyTransactions(update));
}

export function* watchUpdateMyTransactionsListSaga() {
  yield takeEvery(
    Actions.UPDATE_MY_TRANSACTION_LISTS,
    updateMyTransactionsListSaga,
  );
}

export function* updatePendingTransactionsListSaga(
  _action: ActionUpdatePendingTransaction,
) {
  const txs: NashEscrowTransaction[] = yield select(
    selectRampPendingTransactions,
  );

  const update = generateUpdatedList(_action.action, _action.transaction, txs);
  yield put(generateActionSetPendingTransactions(update));
}

/**
 * Watch for actions generated by the escrow transaction event listener.
 */
export function* watchUpdatePendingTransactionsListSaga() {
  yield takeEvery(
    Actions.UPDATE_PENDING_TRANSACTION_LISTS,
    updatePendingTransactionsListSaga,
  );
}

/**
 * Generates an updated list of transactions.
 * @param action what to do with the list.
 * @param transaction the transaction in question.
 * @param currentList the state of the current list.
 * @returns the updated list.
 */
export function generateUpdatedList(
  action: ListUpdateActions,
  transaction: NashEscrowTransaction,
  currentList: NashEscrowTransaction[],
) {
  let updates: NashEscrowTransaction[] = [];

  switch (action) {
    case 'add':
      const obj = updates.find(o => o.id === transaction.id);

      // add a new element to the array.
      if (typeof obj === 'undefined') {
        updates.push(transaction);
      }
      for (let index = 0; index < currentList.length; index++) {
        if (currentList[index].id === transaction.id) {
          updates.push(transaction);
        } else {
          updates.push(currentList[index]);
        }
      }
      break;
    case 'remove':
      for (let index = 0; index < currentList.length; index++) {
        if (currentList[index].id !== transaction.id) {
          updates.push(currentList[index]);
        }
      }
      break;
    default:
      for (let index = 0; index < currentList.length; index++) {
        if (currentList[index].id === transaction.id) {
          updates.push(transaction);
        } else {
          updates.push(currentList[index]);
        }
      }
      break;
  }
  return updates;
}

export function* onRampOffRampSagas() {
  yield spawn(watchQueryPendingTransactionsSaga);
  yield spawn(watchMakeRampExchangeRequestSaga);
  yield spawn(watchAgentFullfilRequestSaga);
  yield spawn(watchQueryMyTransactionsSaga);
  yield spawn(watchApproveTransactionSaga);
  yield spawn(watchUpdateMyTransactionsListSaga);
  yield spawn(watchUpdatePendingTransactionsListSaga);
}
