import {
  call,
  put,
  select,
  spawn,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import {getStoredPrivateKey} from '../../onboarding/utils';
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
} from '../../account_balance/contract.kit.utils';
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
} from './comment.encryption.utils';
import {selectFiatPaymentMethod} from '../../ramp_payment_information/redux_store/selectors';
import {PaymentDetails} from '../../ramp_payment_information/redux_store/reducers';

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
    const address: string = yield select(selectPublicAddress);

    // create a private key session.
    const privateKey: string = yield call(getStoredPrivateKey, action.pin);
    contractKit.addAccount(privateKey);

    const accounts: AccountsWrapper = yield call([
      contractKit.contracts,
      contractKit.contracts.getAccounts,
    ]);

    const shortenedDEK = compressedPubKey(hexToBuffer(privateKey));

    const isExistingAccount: boolean = yield call(accounts.isAccount, address);

    if (!isExistingAccount) {
      // Register account on accounts smart contract.
      const tx: CeloTransactionObject<boolean> = yield call([
        accounts,
        accounts.createAccount,
      ]);

      const receipt: CeloTxReceipt = yield call(
        sendTransactionObject,
        tx.txo,
        address,
      );

      yield call(setDEKSaga, accounts, address, shortenedDEK);
    } else {
      const savedDEK: string = yield call(
        accounts.getDataEncryptionKey,
        address,
      );

      if (shortenedDEK !== savedDEK) {
        yield call(setDEKSaga, accounts, address, shortenedDEK);
      }
    }

    yield put(
      generateActionSetSuccess('Set Data Encryption Key Successfully.'),
    );
    yield put(generateActionSetNormal());
    yield put(generateActionSavedPublicDataEncryptionKey());
  } catch (error) {
    console.log('error===> ', error);
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
  const tx: CeloTransactionObject<void> =
    accountsWrapper.setAccountDataEncryptionKey(shortenedDEK);

  const receipt: CeloTxReceipt = yield call(
    sendTransactionObject,
    tx.txo,
    accountAddress,
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
  let recepientDEK = '';
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
    recepientDEK = yield call(
      fetchAccountPublicDataEncryptionKey,
      agentAddress,
    );
  } else {
    senderDEK = yield call(fetchAccountPublicDataEncryptionKey, clientAddress);
    recepientDEK = yield select(selectPublicKey);
  }

  if (!recepientDEK || !senderDEK || recepientDEK === '' || senderDEK === '') {
    return '';
  }

  const cypherText = encryptEscrowTXComment(comment, senderDEK, recepientDEK);

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
  try {
    const address: string = yield select(selectPublicAddress);
    const transaction = action.transaction;
    const paymentInfoCypherText: string = yield call(
      encryptEscrowComment,
      transaction.clientAddress,
      transaction.agentAddress,
    );

    const tx = nashEscrow.methods.clientWritePaymentInformation(
      transaction.id,
      paymentInfoCypherText,
    );

    const receipt: CeloTxReceipt = yield call(
      sendTransactionObject,
      tx,
      address,
    );
    // TODO: figure out what to do with the receipt.
  } catch (error) {
    console.log('error===> ', error);
  }
}

/**
 * Spawns all the action listeners for the respective sagas.
 */
export function* dataEncryptionSagas() {
  yield spawn(watchSetAccountPublicDataEncryptionKey);
  yield spawn(watchAddClientsPaymentInfoToSaga);
}
