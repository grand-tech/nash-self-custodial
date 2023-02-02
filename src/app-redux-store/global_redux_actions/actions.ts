import {GlobalActions} from './action.patterns';
import {ReduxCoin} from './reducers';

export interface ActionSetCoinDetails {
  type: GlobalActions.SET_COIN_DETAILS;
  addresses: Array<ReduxCoin>;
}

/**
 * Action that triggers logging out logic.
 */
export interface ActionLogOut {
  type: GlobalActions.LOG_OUT;
}

export interface ActionQueryCoinDetails {
  type: GlobalActions.QUERY_COIN_DETAILS;
}

export type ActionTypes =
  | ActionLogOut
  | ActionSetCoinDetails
  | ActionQueryCoinDetails;
