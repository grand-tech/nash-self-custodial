import {Actions} from './action.patterns';
import {
  ActionSetError,
  ActionSetLoading,
  ActionSetNormal,
  ActionEnterPIN,
} from './actions';

/**
 * Generates an instance of set loader action.
 * @param error the error that has occurred.
 * @param message the error message to be displayed.
 * @returns an instance of set error action.
 */
export function generateActionSetError(
  error: any,
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
export function generateActionSetNormal(tag?: string): ActionSetNormal {
  console.log('generateActionSetNormal() ====> ', tag);
  return {
    type: Actions.SET_NORMAL,
  };
}

/**
 * Generate an instance of set enter pin action (prompt the user for their PIN).
 * @returns an instance of set enter pin action.
 */
export function generateActionSetEnterPIN(tag?: string): ActionEnterPIN {
  console.log('generateActionSetEnterPIN() ====> ', tag);
  return {
    type: Actions.SET_ENTER_PIN,
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
  console.log('generateActionSetLoading() ====> ', tag);
  return {
    type: Actions.SET_LOADING,
    title: title,
    body: body,
  };
}
