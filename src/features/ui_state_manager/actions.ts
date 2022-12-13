import {ActionLogOut} from '../../app-redux-store/global_redux_actions/actions';
import {Actions} from './action.patterns';

/**
 * Set current screen to loading state action.
 * @typedef { object } ActionSetLoading action.
 * @property { Actions } type the pattern of the action.
 * @property { string } title the title of the loader to be displayed.
 * @property { string } body the body message of the loader.
 */
export interface ActionSetLoading {
  type: Actions.SET_LOADING;
  title: string;
  body: string;
}

/**
 * Sets the current screen to error state.
 * @typedef { object } ActionSetError action.
 * @property { Actions } type the pattern of the action.
 * @property { any } error the error that has occurred.
 * @property { string } message the error message to be displayed on screen/modal.
 */
export interface ActionSetError {
  type: Actions.SET_ERROR;
  error: any;
  message: string;
}

/**
 * Sets the current screen on idle state. i.e normal screen operations without loaders or errors.
 * @typedef { object } ActionSetNormal action.
 * @property { Actions }
 *
 */
export interface ActionSetNormal {
  type: Actions.SET_NORMAL;
}

/**
 * Sets the current screen on idle state. i.e normal screen operations without loaders or errors.
 * @typedef { object } ActionEnterPIN action.
 * @property { Actions }
 */
export interface ActionEnterPIN {
  type: Actions.SET_ENTER_PIN;
}

/**
 * Sets the current screen success state. i.e the process was successful.
 * @typedef { object } ActionSuccess action.
 * @property { Actions }
 */
export interface ActionSuccess {
  type: Actions.SET_SUCCESS;
  title: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionLogOut //should be at the beginning of all reducers.
  | ActionSetLoading
  | ActionSetError
  | ActionSetNormal
  | ActionEnterPIN
  | ActionSuccess;
