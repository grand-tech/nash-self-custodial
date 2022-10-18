import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import {isAccountNew} from '../../../utils/utils';
import {
  createNewAccountWithMnemonic,
  storeEncryptedMnemonic,
  storeEncryptedPrivateKey,
} from './auth.utils';
import {AccountInformation} from './interfaces';
import {
  ActionCreateNewAccount,
  Actions,
  createdNewAccountAction,
} from '../redux_store/actions';

/**
 * Logic to create a new account.
 * @param action the create new account action.
 */
export function* createAccountSaga(action: ActionCreateNewAccount) {
  let isNewAccount = false;

  while (!isNewAccount) {
    const newAccount: AccountInformation = yield call(
      createNewAccountWithMnemonic,
    );

    // TODO: figure out if this is necessary
    isNewAccount = yield call(isAccountNew, newAccount.address);

    if (isNewAccount) {
      yield call(storeEncryptedMnemonic, newAccount.mnemonic, action.pin);
      yield call(storeEncryptedPrivateKey, newAccount.privateKey, action.pin);
      yield put(
        createdNewAccountAction(newAccount.address, newAccount.publicKey),
      );
    }
  }
}

/**
 * Watches the create new account action.
 */
export function* watchCreateNewAccount() {
  yield takeLatest(Actions.CREATE_NEW_ACCOUNT, createAccountSaga);
}

/**
 * Root saga of the module/feature.
 */
export function* onboardingSaga() {
  yield spawn(watchCreateNewAccount);
}
