import {
  getEncryptedItem,
  KeyChainKeys,
} from '../../utils/session.key.storage.utils';

/**
 * Retrieves a decrypted mnemonic key given the encryption key.
 * @param password the encryption key/password used.
 * @returns the stored mnemonic as cypher text
 */
export async function getStoredMnemonic(
  password: string,
): Promise<string | null> {
  return getEncryptedItem(KeyChainKeys.MNEMONIC_STORAGE_KEY, password);
}

/**
 * Retrieves a decrypted private key given the encryption key.
 * @param password the encryption key.
 * @returns a decrypted private key
 */
export async function getStoredPrivateKey(
  password: string,
): Promise<string | null> {
  return getEncryptedItem(KeyChainKeys.PRIVATE_KEY_STORAGE_KEY, password);
}
