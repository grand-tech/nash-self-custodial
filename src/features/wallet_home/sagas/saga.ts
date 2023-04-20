import {StableToken} from '@celo/contractkit';
import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {ActionSendFunds} from '../redux_store/actions';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {Actions} from '../redux_store/actions';
import {selectPublicKey} from '../../onboarding/redux_store/selectors';
import {generateActionSetSuccess} from '../../ui_state_manager/action.generators';
import {generateActionSetError} from '../../ui_state_manager/action.generators';
import {CeloTxReceipt} from '@celo/connect';
import {
  contractKit,
  sendCEUR,
  sendCREAL,
  sendCUSD,
  web3,
} from '../../../utils/contract.kit.utils';
import {NashCache} from '../../../utils/cache';
import crashlytics from '@react-native-firebase/crashlytics';
import {fetchAccountPublicDataEncryptionKey} from '../../comment_encryption/sagas/saga';
import {nashEncryptComment} from '../../../utils/comment.encryption.utils';
import {EncryptionStatus} from '@celo/cryptographic-utils';
import {store} from '../../../app-redux-store/store';

export function* watchSendFunds() {
  yield takeLatest(Actions.SEND_FUNDS, sendFunds);
}

/**
 * Sends funds from one account to another.
 * @param action contains the necessary variables to send funds from one account to another.
 */
export function* sendFunds(action: ActionSendFunds) {
  const privateKey: string = NashCache.getPrivateKey();

  const receipientAddress: string = action.recipientAddress;
  const comment: string = action.comment;
  const senderDEK: string = yield select(selectPublicKey);

  if (contractKit.defaultAccount === undefined) {
    contractKit.addAccount(privateKey);
  }

  const recipientDEK: string = yield call(
    fetchAccountPublicDataEncryptionKey,
    receipientAddress,
  );

  const encryptionStatus: EncryptionStatus = yield call(
    nashEncryptComment,
    senderDEK,
    recipientDEK,
    comment,
  );
  const encryptedComment = encryptionStatus.comment;

  try {
    const receipt: CeloTxReceipt | undefined = yield call(
      sendFundsTransaction,
      action,
      encryptedComment,
    );
    if (receipt?.status) {
      // call nash APIs to save success transaction details.
      yield put(generateActionSetSuccess('Transaction successful.'));
      yield put(generateActionQueryBalance());
    } else {
      // call nash APIs to save failiure transaction details.
      // Add failed error message display.
      console.log('transaction error.');
    }
  } catch (error: any) {
    crashlytics().recordError(
      new Error(error),
      '[SAGA] sendFunds: ' + error.name,
    );
    console.log(error);
    yield put(generateActionSetError(error.toString(), error.message));
  }
}

/**
 * Sends funds given the action and the comment.
 * @param action the action object with the details needed to send transactions.
 * @param encryptedComment the encrypted comment.
 * @returns the transaction receipt.
 */
export async function sendFundsTransaction(
  action: ActionSendFunds,
  encryptedComment: string,
): Promise<CeloTxReceipt | undefined> {
  const amount = web3.utils.toWei(action.amount.toString());
  const coin = action.coin;
  const address: string = store.getState().onboarding.publicAddress;

  if (coin === StableToken.cUSD) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const receipt: CeloTxReceipt = await sendCUSD(
      address,
      action.recipientAddress,
      amount,
      encryptedComment,
    );
    return receipt;
  } else if (coin === StableToken.cREAL) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const receipt: CeloTxReceipt = await sendCREAL(
      address,
      action.recipientAddress,
      amount,
      encryptedComment,
    );
    return receipt;
  } else if (coin === StableToken.cEUR) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const receipt: CeloTxReceipt = await sendCEUR(
      address,
      action.recipientAddress,
      amount,
      encryptedComment,
    );
    return receipt;
  }

  return undefined;
}

export function* walletSagas() {
  yield spawn(watchSendFunds);
}
