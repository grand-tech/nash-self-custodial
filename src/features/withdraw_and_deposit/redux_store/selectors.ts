import {RootState} from '../../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the stored value.
 */
export const selectRampPendingTransactions = (state: RootState) => {
  return state.ramp.pending_transactions;
};

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the stored value.
 */
export const selectRampMyTransactions = (state: RootState) => {
  return state.ramp.my_transactions;
};

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the stored value.
 */
export const selectFiatPaymentMethod = (state: RootState) => {
  return state.ramp.fiat_payment_method;
};
