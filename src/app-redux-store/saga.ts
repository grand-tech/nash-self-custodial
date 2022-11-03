import {call, spawn} from 'redux-saga/effects';
import {walletBalanceSagas} from '../features/account_balance/saga';
import {currencyConversionSagas} from '../features/currency_conversion/sagas';
import {onboardingSaga} from '../features/onboarding/sagas/sagas';
import {walletSagas} from '../features/wallet_home/sagas/saga';
import {waitForRehydrate} from './redux.persist.helpers';

export function* rootSaga() {
  yield call(waitForRehydrate);
  yield spawn(onboardingSaga);
  yield spawn(walletBalanceSagas);
  yield spawn(walletSagas);
  yield spawn(currencyConversionSagas);
}
