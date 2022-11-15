import {combineReducers} from 'redux';
import {onBoardingReducer} from '../features/onboarding/redux_store/reducers';
import {uiStateReducer} from '../features/ui_state_manager/reducers';
import {balanceReducer} from '../features/account_balance/redux_store/reducers';
import {currencyConversionRatesReducer} from '../features/currency_conversion/reducers';
import {rampStateReducer} from '../features/withdraw_and_deposit/redux_store/reducers';

/**
 * Construct the root reducer from
 */
export const rootReducer = combineReducers({
  onboarding: onBoardingReducer,
  ui_state: uiStateReducer,
  wallet_balance: balanceReducer,
  currency_conversion_rates: currencyConversionRatesReducer,
  ramp: rampStateReducer,
});
