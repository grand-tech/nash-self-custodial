import {Actions} from './action.patterns';
import {ActionTypes} from './actions';
import {NashEscrowTransaction} from '../sagas/nash_escrow_types';
import {GlobalActions} from '../../../app-redux-store/global_redux_actions/action.patterns';

/**
 * Onboarding state object.
 * @typedef { object } UIScreenState state.
 * @property { string } status the screen status.
 * @property { any | null } error an error that has occurred.
 * @property { string | null } message the message to display on status display modal.
 * @property { string  | null} title the tittle message.
 * @property { number } last_updated the last time the status changed.
 */
interface RampState {
  pending_transactions: Array<NashEscrowTransaction>;
  my_transactions: Array<NashEscrowTransaction>;
  last_updated: number;
  selected_request: NashEscrowTransaction | undefined;
}

/**
 * Initial state.
 */
const initialState: RampState = {
  pending_transactions: [],
  my_transactions: [],
  last_updated: new Date().getTime(),
  selected_request: undefined,
};

export const rampStateReducer = (
  state: RampState | undefined = initialState,
  action: ActionTypes,
): RampState => {
  switch (action.type) {
    case Actions.SET_PENDING_TRANSACTION_LISTS:
      return {
        ...state,
        pending_transactions: action.transactions,
        last_updated: new Date().getTime(),
      };
    case Actions.SET_MY_TRANSACTION_LISTS:
      return {
        ...state,
        my_transactions: action.transactions,
        last_updated: new Date().getTime(),
      };
    case Actions.UPDATE_SELECTED_TRANSACTION:
      return {
        ...state,
        selected_request: action.transaction,
      };
    case GlobalActions.LOG_OUT: // should be the second last case in all reducers
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
