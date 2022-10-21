import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import {
  generateNewMnemonic,
  getAccountFromMnemonic,
  storeEncryptedMnemonic,
  storeEncryptedPrivateKey,
} from './auth.utils';
import {AccountInformation} from './interfaces';
import {Actions, ActionCreateNewAccount} from '../redux_store/actions';
import {NashCache} from '../../../utils/cache';
import {generateActionAdoptedNewAccount} from '../redux_store/action.generators';
import {
  generateActionSetNormal,
  generateActionSetLoading,
  generateActionSetError,
} from '../../ui_state_manager/action.generators';

/**
 * Creates a new account and saves its details.
 * @param action action to create new account.
 */
function* createAccount(action: ActionCreateNewAccount) {
  // let isNewAccount = false;

  try {
    // while (!isNewAccount)
    const mnemonic: string = yield call(generateNewMnemonic);

    yield put(generateActionSetLoading('Generating keys', ''));

    const newAccount: AccountInformation = yield call(
      getAccountFromMnemonic,
      mnemonic,
    );

    NashCache.setPinCache(action.pin);
    yield put(generateActionSetLoading('Saving account', ''));
    yield call(storeEncryptedMnemonic, mnemonic, action.pin);
    yield call(storeEncryptedPrivateKey, newAccount.privateKey, action.pin);
    yield put(
      generateActionAdoptedNewAccount(newAccount.address, newAccount.publicKey),
    );
    yield put(generateActionSetNormal());
  } catch (error) {
    yield put(generateActionSetError(error, 'Failed to create account'));
  }
}

/**
 * Watches the create new account action.
 */
export function* watchCreateNewAccount() {
  yield takeLatest(Actions.CREATE_NEW_ACCOUNT, createAccount);
}

/**
 * Root saga of the module/feature.
 */
export function* onboardingSaga() {
  yield spawn(watchCreateNewAccount);
}
