import {Actions} from './action.patterns';
import {ActionTypes} from './actions';

/**
 * Onboarding state object.
 * @typedef { object } UIScreenState state.
 * @property { string } status the screen status.
 * @property { any | null } error an error that has occurred.
 * @property { string } message the message to display on status display modal.
 * @property { string } title the tittle message.
 * @property { number } last_updated the last time the status changed.
 */
interface UIScreenState {
  status: 'loading' | 'error' | 'normal';
  error: any | null;
  message: string | null;
  title: string | null;
  last_updated: number;
}

/**
 * Initial state.
 */
const initialState: UIScreenState = {
  status: 'normal',
  error: null,
  message: null,
  title: null,
  last_updated: new Date().getTime(),
};

export const uiStateReducer = (
  state: UIScreenState | undefined = initialState,
  action: ActionTypes,
): UIScreenState => {
  switch (action.type) {
    case Actions.SET_NORMAL:
      return {
        ...state,
        status: 'normal',
        error: null,
        message: null,
        title: null,
        last_updated: new Date().getTime(),
      };
    case Actions.SET_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.error,
        message: action.message,
        title: 'Oooh Snap!!!',
        last_updated: new Date().getTime(),
      };
    case Actions.SET_LOADING:
      return {
        ...state,
        status: 'loading',
        error: null,
        title: action.title,
        message: action.body,
        last_updated: new Date().getTime(),
      };
    default:
      return state;
  }
};
