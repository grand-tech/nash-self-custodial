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
import {NashCache} from '../../../utils/cache';
import {selectStableCoinAddresses} from '../../../app-redux-store/global_redux_actions/selectors';
import {ReduxCoin} from '../../../app-redux-store/global_redux_actions/reducers';
import crashlytics from '@react-native-firebase/crashlytics';

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
    const addresses: ReduxCoin[] = yield select(selectStableCoinAddresses);

    // create a private key session.
    const privateKey: string = NashCache.getPrivateKey();
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
        addresses[0].address,
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
  const addresses: ReduxCoin[] = yield select(selectStableCoinAddresses);
  const tx: CeloTransactionObject<void> =
    accountsWrapper.setAccountDataEncryptionKey(shortenedDEK);

  const receipt: CeloTxReceipt = yield call(
    sendTransactionObject,
    tx.txo,
    accountAddress,
    addresses[0].address,
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
  const addresses: ReduxCoin[] = yield select(selectStableCoinAddresses);
  const address: string = yield select(selectPublicAddress);
  const transaction = action.transaction;
  try {
    console.log(
      'addClientsPaymentInfoToSaga===>',
      action.transaction.id,
      action.transaction.agentAddress,
    );
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

      const receipt: CeloTxReceipt = yield call(
        sendTransactionObject,
        tx,
        address,
        addresses[0].address,
      );
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
