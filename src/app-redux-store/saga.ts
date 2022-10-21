import {call, spawn} from 'redux-saga/effects';
import {onboardingSaga} from '../features/onboarding/sagas/sagas';
import {waitForRehydrate} from './redux.persist.helpers';

export function* rootSaga() {
  yield call(waitForRehydrate);
  yield spawn(onboardingSaga);
}
