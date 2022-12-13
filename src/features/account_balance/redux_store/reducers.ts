import {GlobalActions} from '../../../app-redux-store/global_redux_actions/action.patterns';
import {Actions, ActionTypes} from './actions';

/**
 * Onboarding state object.
 */
interface WalletBalanceState {
  cUSD: number | string;
  cEUR: number | string;
  cREAL: number | string;
  CELO: number | string;
  lastUpdated: number;
}

/**
 * Initial state.
 */
const initialState: WalletBalanceState = {
  cUSD: '-',
  cEUR: '-',
  cREAL: '-',
  CELO: '-',
  lastUpdated: Date.now(),
};

export const balanceReducer = (
  state: WalletBalanceState | undefined = initialState,
  action: ActionTypes,
): WalletBalanceState => {
  switch (action.type) {
    case Actions.SET_WALLET_BALANCE:
      return {
        ...state,
        cEUR: action.balance.cEUR,
        CELO: action.balance.CELO,
        cREAL: action.balance.cREAL,
        cUSD: action.balance.cUSD,
        lastUpdated: Date.now(),
      };
    case GlobalActions.LOG_OUT: // should be the second last case in all reducers
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
