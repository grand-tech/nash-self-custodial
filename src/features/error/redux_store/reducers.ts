import {Actions, ActionTypes} from './actions';

/**
 * Onboarding state object.
 */
interface ErrorState {
  status: string;
  errorMessage: string;
  displayTime: number;
  errorTitle: string;
  error: any | undefined;
}

/**
 * Initial state.
 */
const initialState: ErrorState = {
  status: '',
  errorMessage: '',
  displayTime: 0,
  errorTitle: '',
  error: undefined,
};

export const errorReducer = (
  state: ErrorState | undefined = initialState,
  action: ActionTypes,
): ErrorState => {
  switch (action.type) {
    case Actions.SET_ERROR:
      return {
        ...state,
        status: '',
        errorMessage: '',
        displayTime: 0,
        errorTitle: '',
        error: undefined,
      };
    case Actions.RESET_ERROR:
      return {
        ...state,
        status: '',
        errorMessage: '',
        displayTime: 0,
        errorTitle: '',
        error: undefined,
      };
    default:
      return state;
  }
};
