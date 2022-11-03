import {StableToken} from '@celo/contractkit';
import {Actions, ActionSendFunds} from './actions';

/**
 * Generates select language action.
 * @param coin the selected language action.
 * @param amount the amount of money to be sent.
 * @param recipientAddress the address receiving the funds.
 * @returns the select language action.
 */
export function generateActionSendFunds(
  coin: StableToken,
  amount: number,
  recipientAddress: string,
  pin: string,
): ActionSendFunds {
  return {
    type: Actions.SEND_FUNDS,
    coin,
    amount,
    recipientAddress,
    pin,
  };
}
