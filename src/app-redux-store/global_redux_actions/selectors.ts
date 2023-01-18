import {RootState} from '../store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the cached stable coin addresses.
 */
export const selectStableCoinAddresses = (state: RootState) => {
  return state.stable_coin_info.addresses;
};
