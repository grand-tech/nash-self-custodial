import {takeLatest, spawn, call, put} from 'redux-saga/effects';
import {Actions} from './action.patterns';
import {getCurrencyRates, CurrencyLayerRates} from './currencyLayerUtils';
import {generateCacheCurrencyConversionRates} from './action.generators';

export function* queryCurrencyConversionRates() {
  const currencyConversionRates: CurrencyLayerRates = yield call(
    getCurrencyRates,
  );
  // figure out how to do error handling/ retries and timers.
  yield put(generateCacheCurrencyConversionRates(currencyConversionRates));
}

export function* watchQueryCurrencyConversionRates() {
  yield takeLatest(
    Actions.FETCH_CURRENCY_CONVERSION_RATES,
    queryCurrencyConversionRates,
  );
}

export function* currencyConversionSagas() {
  yield spawn(watchQueryCurrencyConversionRates);
}
