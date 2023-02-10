import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {Actions} from '../redux_store/action.patterns';
import {
  generateActionSetPendingTransactions,
  generateActionSetMyTransactions,
  generateActionQueryMyTransactions,
  generateActionUpdateSelectedTransaction,
} from '../redux_store/action.generators';
import ReadContractDataKit, {
  convertToNashTransactionObj,
} from './ReadContractDataKit';
import {NashEscrowTransaction, TransactionType} from './nash_escrow_types';
import {
  ActionQueryPendingTransactions,
  ActionMakeRampRequest,
  ActionAgentFulfillRequest,
  ActionRefetchSelectedTransaction,
} from '../redux_store/actions';
import {
  contractKit,
  stableTokenApproveAmount,
  sendTransactionObject,
  web3,
} from '../../../utils/contract.kit.utils';
import {
  generateActionSetSuccess,
  generateActionSetError,
  generateActionSetFlatListStatus,
  generateActionSetLoading,
} from '../../ui_state_manager/action.generators';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {NashCache} from '../../../utils/cache';
import {nashEscrow} from '../../../utils/contract.kit.utils';
import {
  selectCurrentTransaction,
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
import {ListUpdateActions} from '../redux_store/enums';
import {estimateGasFees, GasEstimate} from '../../../utils/gas.fees.sagas';

/**
 * Query the list of pending transactions in the smart contract.
 * @param _action the action with the required payload.
 */
export function* queryPendingTransactionsSaga(
  _action: ActionQueryPendingTransactions,
) {
  if (_action.trigger === 'ui') {
    yield put(generateActionSetFlatListStatus('loading'));
  }

  const kit = ReadContractDataKit.getInstance();
  const myPublicAddress: string = yield select(selectPublicAddress);

  if (_action.userAction === 'refetch') {
    NashCache.setRampPaginator(NashCache.DEFAULT_RAMP_PAGINATOR_VALUE);
  }

  if (typeof kit !== 'undefined') {
    const transactions: NashEscrowTransaction[] = yield call(
      kit.fetchTransactions,
      myPublicAddress,
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

  if (_action.trigger === 'ui') {
    yield put(generateActionSetFlatListStatus('normal'));
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

  if (_action.trigger === 'ui') {
    yield put(generateActionSetFlatListStatus('loading'));
  }

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

  if (_action.trigger === 'ui') {
    yield put(generateActionSetFlatListStatus('normal'));
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

    const myAddress: string = yield select(selectPublicAddress);

    const amount = contractKit.web3.utils.toWei(_action.amount.toString());

    const tokenContract: StableTokenWrapper = yield call(
      [contractKit.contracts, contractKit.contracts.getStableToken],
      _action.coin,
    );

    const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
    const tx: CeloTxObject<any> = yield call(
      generateInitTransactionObject,
      amount.toString(),
      _action.transactionType,
      tokenContract.address,
      _action.coin,
    );
    // TODO: Figure out what to do with the boolean result
    yield call(
      stableTokenApproveAmount,
      _action.coin,
      _action.amount,
      myAddress,
    );

    yield call(sendTransactionObject, tx, myAddress, gasFees);

    yield call(stableTokenApproveAmount, _action.coin, 0, myAddress);

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
 * @param coinAddress the smart contract address.
 * @param coin the coin label.
 * @returns the composed transaction type.
 */
async function generateInitTransactionObject(
  amount: string,
  transactionType: TransactionType,
  coinAddress: String,
  coin: String,
) {
  if (transactionType === TransactionType.DEPOSIT) {
    return nashEscrow.methods.initializeDepositTransaction(
      amount,
      coinAddress,
      coin,
    );
  } else {
    return nashEscrow.methods.initializeWithdrawalTransaction(
      amount,
      coinAddress,
      coin,
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

    const stableTokenContract = newStableToken(web3, transaction.exchangeToken);
    const n = stableTokenContract.methods.symbol();
    const symbol: string = yield call(n.call);

    var stableToken: StableToken = (<any>StableToken)[symbol];

    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);
    const myAddress: string = yield select(selectPublicAddress);
    yield call(
      stableTokenApproveAmount,
      stableToken,
      transaction.amount,
      myAddress,
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
    const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
    yield call(sendTransactionObject, tsxObj, myAddress, gasFees);
    yield call(stableTokenApproveAmount, stableToken, 0, myAddress);
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

export function* watchCancelRequestSaga() {
  yield takeLatest(Actions.CANCEL_TRANSACTION, cancelRequestSaga);
}

/**
 * Cancels a transaction on the escrow.
 * @param _action contains all the details needed to cancel a transaction.
 */
export function* cancelRequestSaga(_action: ActionCancelTransaction) {
  try {
    yield put(generateActionSetLoading('Canceling transaction...', ''));
    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);
    const myAddress = _action.transaction.clientAddress;

    const txObj = nashEscrow.methods.cancelTransaction(_action.transaction.id);
    const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
    yield call(sendTransactionObject, txObj, myAddress, gasFees);

    yield put(generateActionQueryBalance());
    yield put(
      generateActionSetSuccess('Transaction has been canceled succesfully.'),
    );
  } catch (error: any) {
    // TODO: Perform all possible error handling activities.
    console.log('Error [cancelRequestSaga]: ', error);
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
function generateApproveRequestTransaction(
  transaction: NashEscrowTransaction,
  publicAddress: string,
) {
  if (transaction.clientAddress === publicAddress) {
    return nashEscrow.methods.clientConfirmPayment(transaction.id);
  } else {
    return nashEscrow.methods.agentConfirmPayment(transaction.id);
  }
}

export function* approveTransactionSaga(_action: ActionCancelTransaction) {
  try {
    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);

    const myAddress: string = yield select(selectPublicAddress);

    const tsxObj = generateApproveRequestTransaction(
      _action.transaction,
      myAddress,
    );
    const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
    yield call(sendTransactionObject, tsxObj, myAddress, gasFees);

    yield put(generateActionSetSuccess('Approved transaction.'));

    yield put(generateActionQueryBalance());
    yield put(
      generateActionQueryMyTransactions('refetch', [0, 1, 2], 'background'),
    );
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

/**
 * Update the list of my transactions.
 * @param _action what to do with the record and the list.
 * @param _transaction the transaction in question against the list.
 */
export function* updateMyTransactionsList(
  _action: ListUpdateActions,
  _transaction: NashEscrowTransaction,
) {
  const txs: NashEscrowTransaction[] = yield select(selectRampMyTransactions);
  const update = generateUpdatedList(_action, _transaction, txs);
  yield put(generateActionSetMyTransactions(update));
}

/**
 * Update the list of pending transactions.
 * @param _action what to do with the record and the list.
 * @param _transaction the transaction in question against the list.
 */
export function* updatePendingTransactionsList(
  _action: ListUpdateActions,
  _transaction: NashEscrowTransaction,
) {
  const txs: NashEscrowTransaction[] = yield select(
    selectRampPendingTransactions,
  );
  const update = generateUpdatedList(_action, _transaction, txs);
  yield put(generateActionSetPendingTransactions(update));
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

/**
 * Re-fetches the selected transaction to give the
 *  user the accurate state of the transaction.
 * @param _action the redux action object.
 */
export function* refetchSelectedTransaction(
  _action: ActionRefetchSelectedTransaction,
) {
  const latestTx: NashEscrowTransaction = yield call(
    queryTransactionByIndex,
    _action.transaction.id,
  );
  yield put(generateActionUpdateSelectedTransaction(latestTx));
}

/**
 * Queries transactions by index.
 * @param index the transaction index.
 * @returns the queried transaction.
 */
async function queryTransactionByIndex(
  index: number,
): Promise<NashEscrowTransaction> {
  const tx = await nashEscrow?.methods.getTransactionByIndex(index).call();
  let nashTx = convertToNashTransactionObj(tx);
  return nashTx;
}

export function* watchRefetchSelectedTransaction() {
  yield takeLatest(
    Actions.REFETCH_SELECTED_TRANSACTION,
    refetchSelectedTransaction,
  );
}

export function* onRampOffRampSagas() {
  yield spawn(watchQueryPendingTransactionsSaga);
  yield spawn(watchMakeRampExchangeRequestSaga);
  yield spawn(watchAgentFullfilRequestSaga);
  yield spawn(watchQueryMyTransactionsSaga);
  yield spawn(watchApproveTransactionSaga);
  yield spawn(watchCancelRequestSaga);
  yield spawn(watchRefetchSelectedTransaction);
}
