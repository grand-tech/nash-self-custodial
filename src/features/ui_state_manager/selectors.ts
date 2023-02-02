import {RootState} from '../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the error state.
 */
export const selectError = (state: RootState) => state.ui_state.error;

export const selectTitle = (state: RootState) => state.ui_state.title;

export const selectMessage = (state: RootState) => state.ui_state.message;

export const selectLastUpdatedTime = (state: RootState) =>
  state.ui_state.last_updated;

export const selectStatus = (state: RootState) => state.ui_state.status;
