import {call, put, spawn, select, takeEvery} from '@redux-saga/core/effects';
import {
  Actions,
  incrementCountAsyncComplete,
  IncrementAsyncAction,
} from './actions';
import {selectCount} from './selectors';

export function* incrementAsync(action: IncrementAsyncAction) {
  let _incrementAmount = action.amount;
  let _current: number = yield select(selectCount);
  const x: number = yield call(fetchCount, _current, _incrementAmount);
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

export function fetchCount(currentCount = 0, amount = 1) {
  return new Promise<number>(resolve =>
    setTimeout(() => resolve(currentCount + amount), 1000),
  );
}
