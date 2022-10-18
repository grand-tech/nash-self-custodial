import {RootState} from '../../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the error status state.
 */
export const selectErrorStatus = (state: RootState) => state.error.status;
