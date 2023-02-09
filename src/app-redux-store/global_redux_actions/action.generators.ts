import {GlobalActions} from './action.patterns';
import {ActionLogOut} from './actions';

/**
 * Generates log out action object.
 * @returns instance of log out action.
 */
export function generateActionLogout(): ActionLogOut {
  return {
    type: GlobalActions.LOG_OUT,
  };
}
