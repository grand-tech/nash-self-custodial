import {RootState} from '../../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the counter value state.
 */
export const selectCount = (state: RootState) => state.onboarding.value;
