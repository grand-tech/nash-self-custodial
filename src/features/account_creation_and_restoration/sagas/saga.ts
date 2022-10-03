import {call, put, spawn, select, takeEvery} from '@redux-saga/core/effects';
import {
  Actions,
  incrementCountAsyncComplete,
  IncrementAsyncAction,
} from '../redux_store/actions';
import { fetchCount } from './counterAPI';

import {selectCount} from '../redux_store/selectors';

export function* incrementAsync(action: IncrementAsyncAction) {
  let _incrementAmount = action.amount;
  let _current: number = yield select(selectCount);
  const x: number = yield call(fetchCount, _current, _incrementAmount);
  console.log('===========>', x);
  yield put(incrementCountAsyncComplete(x));
}

export function* watchIncrementAsync() {
  yield takeEvery(Actions.INCREMENT_ASYNC, incrementAsync);
  // while (true) {
  //   const action: IncrementAsyncAction = yield take(Actions.INCREMENT_ASYNC);
  //   yield fork(incrementAsync, action.amount);
  // }
}

export function* rootSaga() {
  yield spawn(watchIncrementAsync);
}
