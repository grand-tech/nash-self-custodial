import {WalletBalance} from '../../../utils/account.balance.utils';
import {
  ActionSetWalletBalance,
  ActionQueryWalletBalance,
  Actions,
} from './actions';

/**
 * Generates select language action.
 * @param language the selected language action.
 * @returns the select language action.
 */
export function generateActionSetBalance(
  balance: WalletBalance,
): ActionSetWalletBalance {
  return {
    type: Actions.SET_WALLET_BALANCE,
    balance,
  };
}

/**
 * Generates choose new account action.
 * @returns choose create new account action.
 */
export function generateActionQueryBalance(): ActionQueryWalletBalance {
  return {
    type: Actions.QUERY_WALLET_BALANCE,
  };
}
