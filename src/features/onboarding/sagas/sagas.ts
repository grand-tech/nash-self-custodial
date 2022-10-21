import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import {
  generateNewMnemonic,
  getAccountFromMnemonic,
  getStoredMnemonic,
  storeEncryptedMnemonic,
  storeEncryptedPrivateKey,
} from './auth.utils';
import {AccountInformation} from './interfaces';
import {
  Actions,
  ActionCreateNewAccount,
  ActionConfirmSeedPhrase,
} from '../redux_store/actions';
import {NashCache} from '../../../utils/cache';
import {navigate} from '../../../navigation/navigation.service';
import {
  generateActionAdoptedNewAccount,
  generateActionConfirmedSeedPhrase,
} from '../redux_store/action.generators';
import {isMnemonicValid} from './auth.utils';
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
    navigate('SetUpSeedPhraseInstructions');
    // figure out what to do with this after adding attestation and comment encryption.
    // yield put(generateActionCompletedOnboarding());
  } catch (error) {
    yield put(generateActionSetError(error, 'Failed to create account'));
  }
}

/**
 * Logic to validate and verify that seed phrase has been backed up
 * @param action instance of confirm seed phrase action.
 */
export function* confirmSeedPhrase(action: ActionConfirmSeedPhrase) {
  const pin = NashCache.getPinCache() ?? '';
  const seedPhrase: string = yield call(getStoredMnemonic, pin);

  if (seedPhrase === null) {
    yield put(
      generateActionSetError(
        null,
        'Your device does not have custody of any account!!',
      ),
    );
  } else if (isMnemonicValid(action.seedPhrase)) {
    yield put(generateActionSetError(null, 'Invalid mnemonic!'));
  } else if (seedPhrase === action.seedPhrase) {
    yield put(generateActionConfirmedSeedPhrase());
  } else {
    yield put(generateActionSetError(null, 'Mnemonic values did not match!'));
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
