import {combineReducers} from 'redux';
import {onBoardingReducer} from '../features/onboarding/redux_store/reducers';
import {uiStateReducer} from '../features/ui_state_manager/reducers';

/**
 * Construct the root reducer from
 */
export const rootReducer = combineReducers({
  onboarding: onBoardingReducer,
  ui_state: uiStateReducer,
});
