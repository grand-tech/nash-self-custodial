import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import {isAccountNew} from '../../../utils/utils';
import {
  createNewAccountWithMnemonic,
  storeEncryptedMnemonic,
  storeEncryptedPrivateKey,
} from './auth.utils';
import {AccountInformation} from './interfaces';
import {Actions, ActionAdoptNewAccount} from '../redux_store/actions';
import {NashCache} from '../../../utils/cache';
import {generateActionAdoptedNewAccount} from '../redux_store/action.generators';

/**
 * Logic to create a new account.
 */
export function* createAccountSaga() {
  yield spawn(createAccount);
}

function* createAccount() {
  console.log('================> createAccountSaga', Date());
  let isNewAccount = false;

  while (!isNewAccount) {
    const newAccount: AccountInformation = yield call(
      createNewAccountWithMnemonic,
    );
    console.log('created mnemonic', newAccount);
    // TODO: figure out if this is necessary
    isNewAccount = yield call(isAccountNew, newAccount.address);
    console.log('verified balance', isNewAccount);
    if (isNewAccount) {
      NashCache.setAccountInformationCache(newAccount);
      console.log('cached account');
    }
    console.log('================> createAccountSaga completed', Date());
  }
}
/**
 * Logic to encrypt and save account information.
 * @param action save account action.
 */
export function* encryptAndStoreAccountInformation(
  action: ActionAdoptNewAccount,
) {
  console.log('================> encryptAndStoreAccountInformation');
  let account = NashCache.getAccountInformationCache();
  console.log('acccount cached', account);
  if (account) {
    yield call(storeEncryptedMnemonic, account.mnemonic, action.pin);
    yield call(storeEncryptedPrivateKey, account.privateKey, action.pin);
    yield put(
      generateActionAdoptedNewAccount(account.address, account.publicKey),
    );
    // yield call(createAccountSaga);
    // // yield put(generateActionAdoptNewAccount(action.pin));
  } else {
    console.log('no account to store');
  }
  // cache account information.
}

/**
 * Watches the create new account action.
 */
export function* watchCreateNewAccount() {
  yield takeLatest(Actions.CREATE_NEW_ACCOUNT, createAccountSaga);
}

/**
 * Watches the create new account action.
 */
export function* watchAdoptNewAccount() {
  yield takeLatest(
    Actions.ADOPT_NEW_ACCOUNT,
    encryptAndStoreAccountInformation,
  );
}

/**
 * Root saga of the module/feature.
 */
export function* onboardingSaga() {
  yield spawn(watchCreateNewAccount);
  yield spawn(watchAdoptNewAccount);
}
