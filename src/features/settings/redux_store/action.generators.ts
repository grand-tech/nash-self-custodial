import {Actions} from './action.patterns';
import {ActionChangeUserPin} from './actions';

/**
 * Generates action to update the existing payment methods.
 * @param name the name associated with the m-pesa phone number.
 * @param phoneNumber the mpesa phone number.
 * @returns action to update the existing payment methods.
 */
export function generateActionChangePIN(
  oldPIN: string,
  newPIN: string,
): ActionChangeUserPin {
  return {
    type: Actions.CHANGE_USER_PIN_NUMBER,
    oldPIN,
    newPIN,
  };
}
