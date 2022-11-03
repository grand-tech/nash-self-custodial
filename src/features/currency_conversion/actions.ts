import {Actions} from './action.patterns';
import {CurrencyLayerRates} from './currencyLayerUtils';

/**
 * Triggers the saga to fetch currency conversion rates.
 * @typedef { object } ActionSetLoading action.
 */
export interface ActionFetchCurrencyConversionRates {
  type: Actions.FETCH_CURRENCY_CONVERSION_RATES;
}

/**
 * Sets the current screen to error state.
 * @typedef { object } ActionSetError action.
 * @property { Actions } type the pattern of the action.
 * @property { CurrencyLayerRates } rates the fetched rates.
 */
export interface ActionCacheCurrencyConversionSates {
  type: Actions.CACHE_CURRENCY_CONVERSION_RATES;
  rates: CurrencyLayerRates;
}

export type ActionTypes =
  | ActionCacheCurrencyConversionSates
  | ActionFetchCurrencyConversionRates;
