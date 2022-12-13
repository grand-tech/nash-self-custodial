import {StableToken} from '@celo/contractkit';
import {ActionLogOut} from '../../../app-redux-store/global_redux_actions/actions';
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
export type ActionTypes = ActionLogOut | ActionSendFunds;
