import {StableToken} from '@celo/contractkit';
export enum Actions {
  SEND_FUNDS = 'WALLET/SEND_FUNDS',
}

export interface ActionSendFunds {
  type: Actions.SEND_FUNDS;
  coin: StableToken;
  amount: number;
  recipientAddress: string;
  pin: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes = ActionSendFunds;
