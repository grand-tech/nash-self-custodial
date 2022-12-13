import {NashEscrowTransaction} from '../../withdraw_and_deposit/sagas/nash_escrow_types';

export enum DEKActions {
  SAVE_DATA_ENCRYPTION_KEY = 'DATA_ENCRYPTION/SAVE_DATA_ENCRYPTION_KEY',
  SAVED_DATA_ENCRYPTION_KEY = 'DATA_ENCRYPTION/SAVED_DATA_ENCRYPTION_KEY',
  ADD_CLIENTS_PAYMENT_INFO_TO_TRANSACTION = 'DATA_ENCRYPTION/ADD_CLIENTS_COMMENT_TO_TRANSACTION',
}

export interface ActionSavePublicDataEncryptionKey {
  type: DEKActions.SAVE_DATA_ENCRYPTION_KEY;
  pin: string;
}

export interface ActionSavedPublicDataEncryptionKey {
  type: DEKActions.SAVED_DATA_ENCRYPTION_KEY;
}

/**
 * Action to encrypt clients payment information send it to the smart contract.
 */
export interface ActionAddClientsPaymentInfoToTransaction {
  type: DEKActions.ADD_CLIENTS_PAYMENT_INFO_TO_TRANSACTION;
  transaction: NashEscrowTransaction;
}

/**
 * Create a generic action type.
 */
export type DEKActionTypes =
  | ActionSavePublicDataEncryptionKey
  | ActionSavedPublicDataEncryptionKey
  | ActionAddClientsPaymentInfoToTransaction;
