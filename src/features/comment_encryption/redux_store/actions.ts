export enum DEKActions {
  SAVE_DATA_ENCRYPTION_KEY = 'DATA_ENCRYPTION/SAVE_DATA_ENCRYPTION_KEY',
  SAVED_DATA_ENCRYPTION_KEY = 'DATA_ENCRYPTION/SAVED_DATA_ENCRYPTION_KEY',
}

export interface ActionSavePublicDataEncryptionKey {
  type: DEKActions.SAVE_DATA_ENCRYPTION_KEY;
  pin: string;
}

export interface ActionSavedPublicDataEncryptionKey {
  type: DEKActions.SAVED_DATA_ENCRYPTION_KEY;
}

/**
 * Create a generic action type.
 */
export type DEKActionTypes =
  | ActionSavePublicDataEncryptionKey
  | ActionSavedPublicDataEncryptionKey;
