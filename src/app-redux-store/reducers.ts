import {combineReducers} from 'redux';
import { onBoardingReducer } from '../features/account_creation_and_restoration/redux_store/reducers';


/**
 * Construct the root reducer from
 */
export const rootReducer = combineReducers({
  onboarding: onBoardingReducer
});
