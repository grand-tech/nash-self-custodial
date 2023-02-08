import {call, put, spawn, takeLatest} from 'redux-saga/effects';
import crashlytics from '@react-native-firebase/crashlytics';
import {ActionChangeUserPin} from '../redux_store/actions';
import {Actions} from '../redux_store/action.patterns';
import {
  generateActionSetError,
  generateActionSetSuccess,
} from '../../ui_state_manager/action.generators';
import {getStoredMnemonic, getStoredPrivateKey} from '../../onboarding/utils';
import {
  storeEncryptedMnemonic,
  storeEncryptedPrivateKey,
} from '../../onboarding/sagas/auth.utils';
import {NashCache} from '../../../utils/cache';

/**
 * Updates the users PIN number.
 * @param _action action to create new account.
 */
function* changePIN(_action: ActionChangeUserPin) {
  try {
    const mnemonic: string = yield call(getStoredMnemonic, _action.oldPIN);
    const privateKey: string = yield call(getStoredPrivateKey, _action.oldPIN);
    yield call(storeEncryptedMnemonic, mnemonic, _action.newPIN);
    yield call(storeEncryptedPrivateKey, privateKey, _action.newPIN);
    NashCache.setPinCache(_action.newPIN);
    yield put(
      generateActionSetSuccess(
        'Your PIN number has been updated successfully.',
      ),
    );
  } catch (error: any) {
    yield put(
      generateActionSetError(error.toString(), 'Failed to change pin!'),
    );
    crashlytics().recordError(
      new Error(error),
      '[SAGA] changePIN: ' + error.name,
    );
  }
}

/**
 * Watches the create new account action.
 */
export function* watchChangePinSaga() {
  yield takeLatest(Actions.CHANGE_USER_PIN_NUMBER, changePIN);
}

/**
 * Root saga of the module/feature.
 */
export function* settingsSagas() {
  yield spawn(watchChangePinSaga);
}
