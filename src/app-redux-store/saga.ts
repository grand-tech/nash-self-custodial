import {call, spawn} from 'redux-saga/effects';
import {walletBalanceSagas} from '../features/account_balance/saga';
import {onboardingSaga} from '../features/onboarding/sagas/sagas';
import {waitForRehydrate} from './redux.persist.helpers';

export function* rootSaga() {
  yield call(waitForRehydrate);
  yield spawn(onboardingSaga);
  yield spawn(walletBalanceSagas);
}
