import {Actions} from './action.patterns';
import {ActionSetFlatsListStatus, ActionSuccess} from './actions';
import {
  ActionSetError,
  ActionSetLoading,
  ActionSetNormal,
  ActionEnterPIN,
} from './actions';
import {UI_STATUSES} from './enums';

/**
 * Generates an instance of set loader action.
 * @param error the error that has occurred.
 * @param message the error message to be displayed.
 * @returns an instance of set error action.
 */
export function generateActionSetError(
  error: string,
  message: string,
): ActionSetError {
  return {
    type: Actions.SET_ERROR,
    error: error,
    message: message,
  };
}

/**
 * Generate an instance of set normal action.
 * @returns an instance of set idle action.
 */
export function generateActionSetNormal(): ActionSetNormal {
  return {
    type: Actions.SET_NORMAL,
  };
}

/**
 * Generate an instance of set enter pin action (prompt the user for their PIN).
 * @returns an instance of set enter pin action.
 */
export function generateActionSetEnterPIN(tag?: string): ActionEnterPIN {
  return {
    type: Actions.SET_ENTER_PIN,
  };
}

/**
 * Generate an instance of set success (displays a success message to the user.).
 * @returns an instance of set success action.
 */
export function generateActionSetSuccess(title: string): ActionSuccess {
  return {
    type: Actions.SET_SUCCESS,
    title,
  };
}

/**
 * Generate an instance of set success (displays a success message to the user.).
 * @returns an instance of set success action.
 */
export function generateActionSetFlatListStatus(
  status: UI_STATUSES,
): ActionSetFlatsListStatus {
  return {
    type: Actions.SET_FLATLIST_STATUS,
    status,
  };
}

/**
 * Generates the set loader action.
 * @param title the title of the loader.
 * @param body the body message of the loader.
 * @param tag optional string logged when debugging.
 * @returns an instance of set loader action.
 */
export function generateActionSetLoading(
  title: string,
  body: string,
  tag?: string,
): ActionSetLoading {
  return {
    type: Actions.SET_LOADING,
    title: title,
    body: body,
  };
}
