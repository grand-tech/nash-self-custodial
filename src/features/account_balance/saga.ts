import {selectPublicAddress} from './../onboarding/redux_store/selectors';
import {call, select, spawn, takeLatest, put} from 'redux-saga/effects';
import {Actions} from './redux_store/actions';
import {getBalance, WalletBalance} from './utils';
import {generateActionSetBalance} from './redux_store/action.generators';
import {
  getCurrencyRates,
  CurrencyLayerRates,
} from '../../utils/currencyLayerUtils';

export function* queryWalletBalance() {
  const address: string = yield select(selectPublicAddress);
  const balance: WalletBalance = yield call(getBalance, address);
  const conversions: CurrencyLayerRates = yield call(getCurrencyRates);
  console.log('=============================>', conversions);
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
