import {RootState} from '../../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the stored value.
 */
export const selectFiatPaymentMethod = (state: RootState) => {
  return state.ramp_fiat_payment_methods.payment_methods;
};
