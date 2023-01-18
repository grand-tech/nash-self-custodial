import {StableToken} from '@celo/contractkit';
import {StableTokenRegistryWrapper} from '@celo/contractkit/lib/wrappers/StableTokenRegistry';
import {call, put, spawn, takeEvery} from 'redux-saga/effects';
import {contractKit} from '../../features/account_balance/contract.kit.utils';
import {generateActionSetStableCoinInfo} from './action.generators';
import {GlobalActions} from './action.patterns';
import {ActionSetCoinDetails} from './actions';
import {ReduxCoin} from './reducers';

export function* setStableTokenSaga(_action: ActionSetCoinDetails) {
  const keys = Object.keys(StableToken);

  const addresses: Array<ReduxCoin> = [];

  for (const key of keys) {
    var stableToken: StableToken = (<any>StableToken)[key];

    const contract: StableTokenRegistryWrapper = yield call(
      [contractKit.contracts, contractKit.contracts.getStableToken],
      stableToken,
    );
    const reduxToken: ReduxCoin = {
      symbol: key,
      address: contract.address,
      name: '',
    };
    addresses.push(reduxToken);
  }
  yield put(generateActionSetStableCoinInfo(addresses));
}

export function* watchSetStableTokenSaga() {
  yield takeEvery(GlobalActions.QUERY_COIN_DETAILS, setStableTokenSaga);
}

export function* globalSagas() {
  yield spawn(watchSetStableTokenSaga);
}
