import {RootState} from '../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the error state.
 */
export const selectCurrencyRates = (state: RootState) =>
  state.currency_conversion_rates.rates;
