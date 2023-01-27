/**
 * List of action patterns expected in managing the UI.
 */
export enum Actions {
  /**
   * Display the something is happening on the background.
   */
  SET_LOADING = 'UI_STATE/SET_LOADING',

  /**
   * Display that an error has occurred on a process running in the background.
   */
  SET_ERROR = 'UI_STATE/SET_ERROR',

  /**
   * Normal operations of the screen (no error displays or loaders)
   */
  SET_NORMAL = 'UI_STATE/SET_NORMAL',

  /**
   * Anticipating the user to enter there PIN.
   */
  SET_ENTER_PIN = 'UI_STATE/SET_ENTER_PIN',

  /**
   * Process was successful.
   */
  SET_SUCCESS = 'UI_STATE/SET_SUCCESS',
}
