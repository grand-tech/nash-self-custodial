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
 * Create a generic action type.
 */
export type ActionTypes = ActionSetLoading | ActionSetError | ActionSetNormal;
