import {NashEscrowTransaction} from '../../withdraw_and_deposit/sagas/nash_escrow_types';
import {
  ActionAddClientsPaymentInfoToTransaction,
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

/**
 * Generates saved data encryption key action.
 * @returns saved data encryption key action.
 */
export function generateActionAddClientPaymentInfoToTx(
  transaction: NashEscrowTransaction,
): ActionAddClientsPaymentInfoToTransaction {
  return {
    type: DEKActions.ADD_CLIENTS_PAYMENT_INFO_TO_TRANSACTION,
    transaction,
  };
}
