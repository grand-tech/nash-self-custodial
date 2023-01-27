import {ActionLogOut} from '../../../app-redux-store/global_redux_actions/actions';
import {WalletBalance} from '../utils';
export enum Actions {
  QUERY_WALLET_BALANCE = 'WALLET_BALANCE/QUERY_WALLET_BALANCE',

  SET_WALLET_BALANCE = 'WALLET_BALANCE/SET_WALLET_BALANCE',
}

export interface ActionQueryWalletBalance {
  type: Actions.QUERY_WALLET_BALANCE;
}

export interface ActionSetWalletBalance {
  type: Actions.SET_WALLET_BALANCE;
  balance: WalletBalance;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionLogOut //should be at the beginning of all reducers.
  | ActionQueryWalletBalance
  | ActionSetWalletBalance;
