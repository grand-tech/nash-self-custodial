import {combineReducers} from 'redux';
import { onBoardingReducer } from '../features/onboarding/reducers';


/**
 * Construct the root reducer from
 */
export const rootReducer = combineReducers({
  onboarding: onBoardingReducer
});
