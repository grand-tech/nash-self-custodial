import {
  ActionSavedPublicDataEncryptionKey,
  ActionSavePublicDataEncryptionKey,
  DEKActions,
} from './actions';

/**
 * Generates set data encryption key action.
 * @param pin the pin number to decrypt the private key.
 * @returns set data encryption key action.
 */
export function generateActionSavePublicDataEncryptionKey(
  pin: string,
): ActionSavePublicDataEncryptionKey {
  return {
    type: DEKActions.SAVE_DATA_ENCRYPTION_KEY,
    pin,
  };
}

/**
 * Generates saved data encryption key action.
 * @returns saved data encryption key action.
 */
export function generateActionSavedPublicDataEncryptionKey(): ActionSavedPublicDataEncryptionKey {
  return {
    type: DEKActions.SAVED_DATA_ENCRYPTION_KEY,
  };
}
