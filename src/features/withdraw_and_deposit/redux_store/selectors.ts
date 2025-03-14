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

export const selectCurrentTransaction = (state: RootState) => {
  return state.ramp.selected_request;
};
