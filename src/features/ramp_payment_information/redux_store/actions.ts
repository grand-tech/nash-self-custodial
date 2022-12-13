import {Actions} from './action.patterns';

export interface ActionUpdateFiatPaymentMethods {
  type: Actions.UPDATE_PAYMENT_METHODS;
}

export interface ActionUpdateDefaultFiatPaymentMethods {
  type: Actions.UPDATE_DEFAULT_PAYMENT_METHODS;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionUpdateFiatPaymentMethods
  | ActionUpdateDefaultFiatPaymentMethods;
