import {selectPublicAddress} from './../onboarding/redux_store/selectors';
import {call, select, spawn, takeLatest, put} from 'redux-saga/effects';
import {Actions} from './redux_store/actions';
import {getBalance, WalletBalance} from '../../utils/account.balance.utils';
import {generateActionSetBalance} from './redux_store/action.generators';
import {selectCurrencyRates} from '../currency_conversion/selectors';
import {CurrencyLayerRates} from '../currency_conversion/currencyLayerUtils';
import {generateFetchCurrencyConversionRates} from '../currency_conversion/action.generators';

export function* queryWalletBalance() {
  const address: string = yield select(selectPublicAddress);
  const rates: CurrencyLayerRates | null = yield select(selectCurrencyRates);
  if (!rates) {
    yield put(generateFetchCurrencyConversionRates());
  }
  const balance: WalletBalance = yield call(getBalance, address);
  if (
    typeof balance.cEUR !== 'undefined' &&
    typeof balance.cUSD !== 'undefined'
  ) {
    yield put(generateActionSetBalance(balance));
  }
}

/**
 * Watches the restore existing account action.
 */
export function* watchQueryBalance() {
  yield takeLatest(Actions.QUERY_WALLET_BALANCE, queryWalletBalance);
}

/**
 * Root saga of the module/feature.
 */
export function* walletBalanceSagas() {
  yield spawn(watchQueryBalance);
}
