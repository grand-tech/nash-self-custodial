import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import {
  clearSession,
  generateNewMnemonic,
  getAccountFromMnemonic,
  storeEncryptedMnemonic,
  storeEncryptedPrivateKey,
} from './auth.utils';
import {AccountInformation} from './interfaces';
import {Actions, ActionCreateNewAccount} from '../redux_store/actions';
import {NashCache} from '../../../utils/cache';
import {navigate} from '../../../navigation/navigation.service';
import {
  generateActionAdoptedNewAccount,
  generateActionCompletedOnboarding,
} from '../redux_store/action.generators';
import {ActionRestoreExistingAccount} from '../redux_store/actions';
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

    yield put(
      generateActionSetLoading('Generating keys', '', 'generating keys'),
    );

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
    yield put(generateActionSetNormal('create account'));
    navigate('SetUpSeedPhraseInstructions');
  } catch (error: any) {
    yield put(
      generateActionSetError(error.toString(), 'Failed to create account'),
    );
  }
}

/**
 * Creates a new account and saves its details.
 * @param action action to create new account.
 */
function* restoreExistingAccount(action: ActionRestoreExistingAccount) {
  try {
    const mnemonic: string = action.mnemonic;

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
    yield put(generateActionSetNormal('restore account'));
    //TODO: figure out what to do with this after adding attestation and comment encryption.
    yield put(generateActionCompletedOnboarding());
  } catch (error: any) {
    console.log('error', error);
    yield put(
      generateActionSetError(error.toString(), 'Failed to restore account'),
    );
  }
}

/**
 * Watches the create new account action.
 */
export function* watchCreateNewAccount() {
  yield takeLatest(Actions.CREATE_NEW_ACCOUNT, createAccount);
}

/**
 * Watches the restore existing account action.
 */
export function* watchRestoreExistingAccount() {
  yield takeLatest(Actions.RESTORE_EXISTING_ACCOUNT, restoreExistingAccount);
}

/**
 * Delete the users private key and mnemonic from key chain.
 */
export function* logOut() {
  yield call(clearSession);
}

/**
 * Watches the restore existing account action.
 */
export function* watchLogOut() {
  yield takeLatest(Actions.LOG_OUT, logOut);
}

/**
 * Root saga of the module/feature.
 */
export function* onboardingSaga() {
  yield spawn(watchCreateNewAccount);
  yield spawn(watchRestoreExistingAccount);
  yield spawn(watchLogOut);
}
