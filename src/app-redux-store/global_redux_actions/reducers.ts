import {GlobalActions} from './action.patterns';
import {ActionTypes} from './actions';

/**
 * Interface holding a coins details on the current network.
 */
export interface ReduxCoin {
  symbol: string;
  address: string;
  name: string;
}

/**
 * Onboarding state object.
 */
interface StableCoinsState {
  addresses: Array<ReduxCoin>;
}

/**
 * Initial state.
 */
const initialState: StableCoinsState = {
  addresses: [],
};

export const stableCoinInfo = (
  state: StableCoinsState | undefined = initialState,
  action: ActionTypes,
): StableCoinsState => {
  switch (action.type) {
    case GlobalActions.SET_COIN_DETAILS:
      return {
        ...state,
        addresses: action.addresses,
      };
    case GlobalActions.LOG_OUT: // should be the second last case in all reducers
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
