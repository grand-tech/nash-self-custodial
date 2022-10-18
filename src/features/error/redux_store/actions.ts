export enum Actions {
  SET_ERROR = 'ERROR/SET_ERROR',
  RESET_ERROR = 'ERROR/RESET_ERROR',
}

export interface ActionSetError {
  type: Actions.SET_ERROR;
  status: 'asleep' | 'active';
  errorMessage: string;
  displayTime: number;
  errorTitle: string;
  error: undefined;
}

export interface ActionResetError {
  type: Actions.RESET_ERROR;
}

/**
 * Create a generic action type.
 */
export type ActionTypes = ActionSetError | ActionResetError;

export function setError(
  errorMessage: string,
  displayTime: number,
  errorTitle: string,
  error: any,
): ActionSetError {
  return {
    type: Actions.SET_ERROR,
    status: 'active',
    errorMessage: errorMessage,
    displayTime: displayTime,
    errorTitle: errorTitle,
    error: error,
  };
}

export function resetError(): ActionResetError {
  return {
    type: Actions.RESET_ERROR,
  };
}
