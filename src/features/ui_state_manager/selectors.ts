import {RootState} from '../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the error state.
 */
export const selectError = (state: RootState) => state.uiStateReducer.error;

export const selectTitle = (state: RootState) => state.uiStateReducer.title;

export const selectMessage = (state: RootState) => state.uiStateReducer.message;

export const selectLastUpdatedTime = (state: RootState) =>
  state.uiStateReducer.last_updated;

export const selectStatus = (state: RootState) => state.uiStateReducer.status;
