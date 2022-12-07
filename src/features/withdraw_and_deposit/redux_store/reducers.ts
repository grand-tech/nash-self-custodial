import {Actions} from './action.patterns';
import {ActionTypes} from './actions';
import {NashEscrowTransaction} from '../sagas/nash_escrow_types';

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
  fiat_payment_method: PaymentDetails;
}

export interface PaymentDetails {
  name: string;
  paymentMethod: FiatPaymentMethod;
  phoneNumber: string;
  paybill: string;
  accountNo: string;
  setPaymentDetails: boolean;
}

export enum FiatPaymentMethod {
  MPESA_PHONE_NUMBER,
  MPESA_POCHI_LA_BIASHARA,
  MPESA_PAYBILL,
}

/**
 * Initial state.
 */
const initialState: RampState = {
  pending_transactions: [],
  my_transactions: [],
  last_updated: new Date().getTime(),
  fiat_payment_method: {
    name: 'Allen Muhani',
    paymentMethod: FiatPaymentMethod.MPESA_PHONE_NUMBER,
    phoneNumber: '+254791725651',
    paybill: '',
    accountNo: '',
    setPaymentDetails: true,
  },
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
    default:
      return state;
  }
};
