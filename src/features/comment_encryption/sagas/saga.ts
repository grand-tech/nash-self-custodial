import {
  call,
  put,
  select,
  spawn,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import {
  ActionAddClientsPaymentInfoToTransaction,
  ActionSavePublicDataEncryptionKey,
  DEKActions,
} from '../redux_store/actions';
import {
  selectPublicAddress,
  selectPublicKey,
} from '../../onboarding/redux_store/selectors';
import {AccountsWrapper} from '@celo/contractkit/lib/wrappers/Accounts';
import {CeloTransactionObject, CeloTxReceipt} from '@celo/connect';
import {
  contractKit,
  nashEscrow,
  sendTransactionObject,
} from '../../../utils/contract.kit.utils';
import {compressedPubKey} from '@celo/cryptographic-utils';
import {hexToBuffer} from '@celo/utils/lib/address';
import {
  generateActionSetNormal,
  generateActionSetSuccess,
} from '../../ui_state_manager/action.generators';
import {generateActionSavedPublicDataEncryptionKey} from '../redux_store/action.generators';
import {
  encryptEscrowTXComment,
  EscrowTxComment,
} from '../../../utils/comment.encryption.utils';
import {selectFiatPaymentMethod} from '../../ramp_payment_information/redux_store/selectors';
import {PaymentDetails} from '../../ramp_payment_information/redux_store/reducers';
import {NashCache} from '../../../utils/cache';
import crashlytics from '@react-native-firebase/crashlytics';
import {estimateGasFees, GasEstimate} from '../../../utils/gas.fees.sagas';

/**
 * Listen for the action to set an accounts public data
 *  encryption key in the accounts smart contract.
 */
export function* watchSetAccountPublicDataEncryptionKey() {
  yield takeLeading(
    DEKActions.SAVE_DATA_ENCRYPTION_KEY,
    setAccountPublicDataEncryptionKey,
  );
}

/**
 * Sets the data encryption key of an account in the accounts smart contract.
 * @param action the action and the required details.
 */
export function* setAccountPublicDataEncryptionKey(
  action: ActionSavePublicDataEncryptionKey,
) {
  try {
    const myAddress: string = yield select(selectPublicAddress);

    // create a private key session.
    const privateKey: string = NashCache.getPrivateKey();
    contractKit.addAccount(privateKey);

    const accounts: AccountsWrapper = yield call([
      contractKit.contracts,
      contractKit.contracts.getAccounts,
    ]);

    const shortenedDEK = compressedPubKey(hexToBuffer(privateKey));

    const isExistingAccount: boolean = yield call(
      accounts.isAccount,
      myAddress,
    );

    if (!isExistingAccount) {
      // Register account on accounts smart contract.
      const tx: CeloTransactionObject<boolean> = yield call([
        accounts,
        accounts.createAccount,
      ]);
      const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
      yield call(sendTransactionObject, tx.txo, myAddress, gasFees);

      yield call(setDEKSaga, accounts, myAddress, shortenedDEK);
    } else {
      const savedDEK: string = yield call(
        accounts.getDataEncryptionKey,
        myAddress,
      );

      if (shortenedDEK !== savedDEK) {
        yield call(setDEKSaga, accounts, myAddress, shortenedDEK);
      }
    }

    yield put(
      generateActionSetSuccess('Set Data Encryption Key Successfully.'),
    );
    yield put(generateActionSetNormal());
    yield put(generateActionSavedPublicDataEncryptionKey());
  } catch (error: any) {
    crashlytics().recordError(
      new Error(error),
      '[SAGA] setAccountPublicDataEncryptionKey: ' + error.name,
    );
    console.error('[ERROR] [SAGA] setAccountPublicDataEncryptionKey:', error);
  }
}

/**
 * Writes an accounts data encryption key to the smart contract.
 * @param accountsWrapper instance of the accounts smart contracts wrapper.
 * @param accountAddress the account address.
 * @param shortenedDEK shortened data encryption key.
 */
export function* setDEKSaga(
  accountsWrapper: AccountsWrapper,
  accountAddress: string,
  shortenedDEK: string,
) {
  const myAddress: string = yield select(selectPublicAddress);
  const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
  const tx: CeloTransactionObject<void> =
    accountsWrapper.setAccountDataEncryptionKey(shortenedDEK);

  const receipt: CeloTxReceipt = yield call(
    sendTransactionObject,
    tx.txo,
    accountAddress,
    gasFees,
  );
}

/**
 * Fetch an account`s public data encryption key.
 * @param publicAddress the account who`s public key is to be fetched.
 * @returns the public data encryption key.
 */
export async function fetchAccountPublicDataEncryptionKey(
  publicAddress: string,
) {
  if (contractKit) {
    const accounts: AccountsWrapper = await contractKit.contracts.getAccounts();
    const dek: string = await accounts.getDataEncryptionKey(publicAddress);
    return dek;
  }
  return '';
}

/**
 * Object with escrow content to be encrypted.
 * @param clientAddress the clients address.
 * @param agentAddress the agents address.
 */
export function* encryptEscrowComment(
  clientAddress: string,
  agentAddress: string,
) {
  const myAddress: string = yield select(selectPublicAddress);
  let recipientDEK = '';
  let senderDEK = '';
  const paymentInfo: PaymentDetails = yield select(selectFiatPaymentMethod);
  const comment: EscrowTxComment = {
    mpesaNumber: paymentInfo.phoneNumber,
    payBill: paymentInfo.paybill,
    accountNumber: paymentInfo.accountNo,
    paymentName: paymentInfo.name,
  };
  if (myAddress === clientAddress) {
    senderDEK = yield select(selectPublicKey);
    recipientDEK = yield call(
      fetchAccountPublicDataEncryptionKey,
      agentAddress,
    );
  } else {
    senderDEK = yield call(fetchAccountPublicDataEncryptionKey, clientAddress);
    recipientDEK = yield select(selectPublicKey);
  }

  if (!recipientDEK || !senderDEK || recipientDEK === '' || senderDEK === '') {
    return '';
  }

  const cypherText = encryptEscrowTXComment(comment, senderDEK, recipientDEK);

  if (cypherText.success) {
    return cypherText.comment;
  }
  return '';
}

/**
 * Listen for the action to set an accounts public data
 *  encryption key in the accounts smart contract.
 */
export function* watchAddClientsPaymentInfoToSaga() {
  yield takeEvery(
    DEKActions.ADD_CLIENTS_PAYMENT_INFO_TO_TRANSACTION,
    addClientsPaymentInfoToSaga,
  );
}

/**
 * Sets the data encryption key of an account in the accounts smart contract.
 * @param action the action and the required details.
 */
export function* addClientsPaymentInfoToSaga(
  action: ActionAddClientsPaymentInfoToTransaction,
) {
  const myAddress: string = yield select(selectPublicAddress);
  const gasFees: GasEstimate = yield call(estimateGasFees, myAddress);
  const transaction = action.transaction;
  try {
    if (transaction.agentAddress !== '' && transaction.clientAddress !== '') {
      const paymentInfoCypherText: string = yield call(
        encryptEscrowComment,
        transaction.clientAddress,
        transaction.agentAddress,
      );

      const tx = nashEscrow.methods.clientWritePaymentInformation(
        transaction.id,
        paymentInfoCypherText,
      );

      const privateKey: string = NashCache.getPrivateKey();
      contractKit.addAccount(privateKey);

      yield call(sendTransactionObject, tx, myAddress, gasFees);
    } else {
      console.error(
        'ERROR: [addClientsPaymentInfoToSaga] invalid public addresses.',
      );
    }

    // TODO: figure out what to do with the receipt.
  } catch (error: any) {
    crashlytics().recordError(
      new Error(error),
      '[SAGA] addClientsPaymentInfoToSaga: ' + error.name,
    );
    console.log('[ERROR] [SAGA] addClientsPaymentInfoToSaga:', error);
  }
}

/**
 * Spawns all the action listeners for the respective sagas.
 */
export function* dataEncryptionSagas() {
  yield spawn(watchSetAccountPublicDataEncryptionKey);
  yield spawn(watchAddClientsPaymentInfoToSaga);
}
