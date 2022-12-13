import {Actions} from './action.patterns';
import {ActionTypes} from './actions';

/**
 * Onboarding state object.
 * @typedef { object } UIScreenState state.
 * @property { string } status the screen status.
 * @property { any | null } error an error that has occurred.
 * @property { string | null } message the message to display on status display modal.
 * @property { string  | null} title the tittle message.
 * @property { number } last_updated the last time the status changed.
 */
interface RampFiatPaymentMethods {
  last_updated: number;
  payment_methods: PaymentDetails;
  default_payment_method: FiatPaymentMethod;
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
const initialState: RampFiatPaymentMethods = {
  last_updated: new Date().getTime(),
  payment_methods: {
    name: 'Jane Done',
    paymentMethod: FiatPaymentMethod.MPESA_PHONE_NUMBER,
    phoneNumber: '+254791725651',
    paybill: '',
    accountNo: '',
    setPaymentDetails: true,
  },
  default_payment_method: FiatPaymentMethod.MPESA_PHONE_NUMBER,
};

export const rampFiatPaymentMethods = (
  state: RampFiatPaymentMethods | undefined = initialState,
  action: ActionTypes,
): RampFiatPaymentMethods => {
  switch (action.type) {
    case Actions.UPDATE_DEFAULT_PAYMENT_METHODS:
      return {
        ...state,
        last_updated: new Date().getTime(),
      };
    case Actions.UPDATE_PAYMENT_METHODS:
      return {
        ...state,
        last_updated: new Date().getTime(),
      };
    default:
      return state;
  }
};
