import {combineReducers} from 'redux';
import {reducer} from '../features/counter/reducers';

/**
 * Construct the root reducer from
 */
export const rootReducer = combineReducers({
  counterStore: reducer,
});
