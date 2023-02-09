import {GlobalActions} from './action.patterns';

/**
 * Action that triggers logging out logic.
 */
export interface ActionLogOut {
  type: GlobalActions.LOG_OUT;
}

export type ActionTypes = ActionLogOut;
