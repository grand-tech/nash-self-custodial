import {call, spawn} from 'redux-saga/effects';
import {walletBalanceSagas} from '../features/account_balance/saga';
import {dataEncryptionSagas} from '../features/comment_encryption/sagas/saga';
import {currencyConversionSagas} from '../features/currency_conversion/sagas';
import {onboardingSagas} from '../features/onboarding/sagas/sagas';
import {settingsSagas} from '../features/settings/sagas/sagas';
import {walletSagas} from '../features/wallet_home/sagas/saga';
import {rampEscrowContractEventListenerSagas} from '../features/withdraw_and_deposit/sagas/nash.contract.event.sagas';
import {onRampOffRampSagas} from '../features/withdraw_and_deposit/sagas/saga';
import {waitForRehydrate} from './redux.persist.helpers';

export function* rootSaga() {
  yield call(waitForRehydrate);
  yield spawn(onboardingSagas);
  yield spawn(walletBalanceSagas);
  yield spawn(walletSagas);
  yield spawn(currencyConversionSagas);
  yield spawn(onRampOffRampSagas);
  yield spawn(rampEscrowContractEventListenerSagas);
  yield spawn(dataEncryptionSagas);
  yield spawn(settingsSagas);
}
