import {Actions} from './action.patterns';
import {ActionUpdateFiatPaymentMethods} from './actions';

/**
 * Generates action to update the existing payment methods.
 * @param name the name associated with the m-pesa phone number.
 * @param phoneNumber the mpesa phone number.
 * @returns action to update the existing payment methods.
 */
export function generateRampActionUpdateFiatPaymentMethods(
  name: string,
  phoneNumber: string,
): ActionUpdateFiatPaymentMethods {
  return {
    type: Actions.UPDATE_PAYMENT_METHODS,
    name,
    mpesaPhoneNumber: phoneNumber,
  };
}
