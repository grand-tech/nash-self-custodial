import {RootState} from '../../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the cached value of the wallet balance.
 */
export const selectWalletBalance = (state: RootState) => {
  return {
    cUSD: state.wallet_balance.cUSD,
    cEUR: state.wallet_balance.cEUR,
    CELO: state.wallet_balance.CELO,
    cREAL: state.wallet_balance.cREAL,
    last_update: state.wallet_balance.lastUpdated,
  };
};
