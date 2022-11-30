import {call, put, select, spawn, takeLeading} from 'redux-saga/effects';
import {getStoredPrivateKey} from '../../onboarding/utils';
import {
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
  sendTransactionObject,
} from '../../account_balance/contract.kit.utils';
import {compressedPubKey} from '@celo/cryptographic-utils';
import {hexToBuffer} from '@celo/utils/lib/address';
import {
  generateActionSetNormal,
  generateActionSetSuccess,
} from '../../ui_state_manager/action.generators';
import {generateActionSavedPublicDataEncryptionKey} from '../redux_store/action.generators';

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

      console.log('=====>', receipt.status);
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
    const p: string = yield select(selectPublicKey);
    console.log(shortenedDEK, p);
  } catch (error) {
    console.log('error===> ', error);
  }
}

/**
 *
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
  console.log(receipt.status);
}

/**
 * Fetch an account`s public data encryption key.
 * @param publicAddress the account who`s public key is to be fetched.
 * @returns the public data encryption key.
 */
export function* fetchAccountPublicDataEncryptionKey(publicAddress: string) {
  const contracts = contractKit.contracts;
  if (contracts) {
    const accounts: AccountsWrapper = yield call(contracts.getAccounts);
    const dek: string = yield call(
      accounts.getDataEncryptionKey,
      publicAddress,
    );
    return dek;
  }
  return '';
}

/**
 * Spawns all the action listeners for the respective sagas.
 */
export function* dataEncryptionSagas() {
  yield spawn(watchSetAccountPublicDataEncryptionKey);
}
