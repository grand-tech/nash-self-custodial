import {Actions} from './action.patterns';
import {ActionUpdateDefaultFiatPaymentMethods} from './actions';

/**
 * Generates action to update the existing payment methods.
 * @returns action to update the existing payment methods.
 */
export function generateActionSendFunds(): ActionUpdateDefaultFiatPaymentMethods {
  return {
    type: Actions.UPDATE_DEFAULT_PAYMENT_METHODS,
  };
}
