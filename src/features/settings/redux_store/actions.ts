import {ActionLogOut} from '../../../app-redux-store/global_redux_actions/actions';
import {Actions} from './action.patterns';

/**
 * Action used to trigger logic to change the users PIN on this device.
 */
export interface ActionChangeUserPin {
  type: Actions.CHANGE_USER_PIN_NUMBER;
  newPIN: string;
  oldPIN: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionLogOut //should be at the beginning of all reducers.
  | ActionChangeUserPin;
