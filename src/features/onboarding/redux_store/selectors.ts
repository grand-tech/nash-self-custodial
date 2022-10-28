import {RootState} from '../../../app-redux-store/store';

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the public address state.
 */
export const selectPublicAddress = (state: RootState) => {
  // console.log(state);
  return state.onboarding.publicAddress;
};

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the public key state.
 */
export const selectPublicKey = (state: RootState) => state.onboarding.publicKey;

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the onboarding status state.
 */
export const selectOnboardingStatus = (state: RootState) =>
  state.onboarding.status;

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the verified mnemonic backup state.
 */
export const selectVerifiedMnemonicBackup = (state: RootState) =>
  state.onboarding.verifiedMnemonicBackup;

/**
 * Retrieves value state from redux store.
 * @param state the applications redux state.
 * @returns the value stored in the encrypted private key state.
 */
export const selectStoredEncryptedPrivateKey = (state: RootState) =>
  state.onboarding.storedEncryptedPrivateKey;
