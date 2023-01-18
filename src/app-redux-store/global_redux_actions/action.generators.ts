import {GlobalActions} from './action.patterns';
import {
  ActionLogOut,
  ActionQueryCoinDetails,
  ActionSetCoinDetails,
} from './actions';
import {ReduxCoin} from './reducers';

/**
 * Generates log out action object.
 * @returns instance of log out action.
 */
export function generateActionLogout(): ActionLogOut {
  return {
    type: GlobalActions.LOG_OUT,
  };
}

export function generateActionSetStableCoinInfo(
  info: Array<ReduxCoin>,
): ActionSetCoinDetails {
  return {
    type: GlobalActions.SET_COIN_DETAILS,
    addresses: info,
  };
}

export function generateActionQueryStableCoinInfo(): ActionQueryCoinDetails {
  return {
    type: GlobalActions.QUERY_COIN_DETAILS,
  };
}
