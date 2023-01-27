import {ActionLogOut} from '../../../app-redux-store/global_redux_actions/actions';
import {Actions} from './action.patterns';

/**
 * Updates fiat payment information on redux.
 */
export interface ActionUpdateFiatPaymentMethods {
  type: Actions.UPDATE_PAYMENT_METHODS;
  name: string;
  mpesaPhoneNumber: string;
}

export interface ActionUpdateDefaultFiatPaymentMethods {
  type: Actions.UPDATE_DEFAULT_PAYMENT_METHODS;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionLogOut //should be at the beginning of all reducers.
  | ActionUpdateFiatPaymentMethods
  | ActionUpdateDefaultFiatPaymentMethods;
