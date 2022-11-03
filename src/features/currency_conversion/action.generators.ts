import {Actions} from './action.patterns';
import {CurrencyLayerRates} from './currencyLayerUtils';
import {
  ActionFetchCurrencyConversionRates,
  ActionCacheCurrencyConversionSates,
} from './actions';

/**
 * Generates action to fetch currency conversion rates.
 * @returns an instance of set error action.
 */
export function generateFetchCurrencyConversionRates(): ActionFetchCurrencyConversionRates {
  return {
    type: Actions.FETCH_CURRENCY_CONVERSION_RATES,
  };
}

/**
 * Generate an instance of set normal action.
 * @returns an instance of set idle action.
 */
export function generateCacheCurrencyConversionRates(
  rates: CurrencyLayerRates,
): ActionCacheCurrencyConversionSates {
  return {
    type: Actions.CACHE_CURRENCY_CONVERSION_RATES,
    rates,
  };
}
