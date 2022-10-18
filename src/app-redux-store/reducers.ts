import {combineReducers} from 'redux';
import {errorReducer} from '../features/error/redux_store/reducers';
import {onBoardingReducer} from '../features/onboarding/redux_store/reducers';

/**
 * Construct the root reducer from
 */
export const rootReducer = combineReducers({
  onboarding: onBoardingReducer,
  error: errorReducer,
});
