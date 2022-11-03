import {Actions} from './action.patterns';
import {ActionTypes} from './actions';
import {CurrencyLayerRates} from './currencyLayerUtils';

/**
 * Currency conversion state object.
 * @typedef { object } CurrencyConversionRates state.
 * @property { number } last_updated the last time the status changed.
 */
interface CurrencyConversionRates {
  rates: CurrencyLayerRates | null;
  last_updated: number;
}

/**
 * Initial state.
 */
const initialState: CurrencyConversionRates = {
  rates: null,
  last_updated: new Date().getTime(),
};

export const currencyConversionRatesReducer = (
  state: CurrencyConversionRates | undefined = initialState,
  action: ActionTypes,
): CurrencyConversionRates => {
  switch (action.type) {
    case Actions.CACHE_CURRENCY_CONVERSION_RATES:
      return {
        ...state,
        rates: action.rates,
        last_updated: new Date().getTime(),
      };
    default:
      return state;
  }
};
