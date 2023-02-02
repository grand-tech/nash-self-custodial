import {GlobalActions} from '../../app-redux-store/global_redux_actions/action.patterns';
import {Actions} from './action.patterns';
import {ActionTypes} from './actions';
import {UI_STATUSES} from './enums';

/**
 * Onboarding state object.
 * @typedef { object } UIScreenState state.
 * @property { string } status the screen status.
 * @property { any | null } error an error that has occurred.
 * @property { string | null } message the message to display on status display modal.
 * @property { string  | null} title the tittle message.
 * @property { number } last_updated the last time the status changed.
 */
interface UIScreenState {
  status: UI_STATUSES;
  error: string | null;
  message: string | null;
  title: string | null;
  last_updated: number;
  flat_list_status: UI_STATUSES;
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
  flat_list_status: 'normal',
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
    case Actions.SET_SUCCESS:
      return {
        ...state,
        status: 'success',
        error: null,
        title: null,
        message: null,
        last_updated: new Date().getTime(),
      };
    case Actions.SET_ENTER_PIN:
      return {
        ...state,
        status: 'enter_pin',
        error: null,
        title: null,
        message: null,
        last_updated: new Date().getTime(),
      };
    case Actions.SET_FLATLIST_STATUS:
      return {
        ...state,
        flat_list_status: action.status,
        last_updated: new Date().getTime(),
      };
    case GlobalActions.LOG_OUT: // should be the second last case in all reducers
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
