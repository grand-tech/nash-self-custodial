import {WalletBalance} from '../utils';
export enum Actions {
  QUERY_WALLET_BALANCE = 'WALLET_BALANCE/QUERY_WALLET_BALANCE',

  SET_WALLET_BALANCE = 'WALLET_BALANCE/SET_WALLET_BALANCE',
  LOG_OUT = 'ONBOARDING/LOG_OUT',
}

export interface ActionQueryWalletBalance {
  type: Actions.QUERY_WALLET_BALANCE;
}

export interface ActionLogOut {
  type: Actions.LOG_OUT;
}

export interface ActionSetWalletBalance {
  type: Actions.SET_WALLET_BALANCE;
  balance: WalletBalance;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionQueryWalletBalance
  | ActionSetWalletBalance
  | ActionLogOut;
