import * as Keychain from 'react-native-keychain';
import {decryptCypherText, encryptPlainText} from './encryption.utils';

const TAG = 'storage/keychain';

export enum KeyChainKeys {
  MNEMONIC_STORAGE_KEY = 'mnemonic',
  PRIVATE_KEY_STORAGE_KEY = 'private_key',
}

/**
 * Stores an item as a key value map in keychain.
 * @param storageKey the storage key holding the value in storage.
 * @param value the value to be stored.
 * @param options key chain options.
 * @returns the storage process result.
 */
export async function storeItem(
  storageKey: string,
  value: string,
  options: Keychain.Options = {},
) {
  try {
    const result = await Keychain.setGenericPassword('NASH', value, {
      service: storageKey,
      accessible: Keychain.ACCESSIBLE.ALWAYS,
      rules: Keychain.SECURITY_RULES.NONE,
      ...options,
    });

    if (result == false) {
      throw new Error('Store result false');
    }

    // check that we can correctly read the keychain before proceeding
    const retrievedResult = await retrieveStoredItem(storageKey);
    if (retrievedResult !== value) {
      await removeStoredItem(storageKey);

      console.log(
        `${TAG}@storeItem`,
        `Retrieved value for key '${storageKey}' does not match stored value`,
      );

      throw new Error(
        `Retrieved value for key '${storageKey}' does not match stored value`,
      );
    }

    return result;
  } catch (error) {
    console.log(TAG, 'Error storing item', error, value);
    throw error;
  }
}

/**
 * Retrieves the value stored in keychain given the storage key and key chain options.
 * @param storageKey the key of the item in keychain.
 * @param options the keychain storage options.
 * @returns the value stored in keychain.
 */
export async function retrieveStoredItem(
  storageKey: string,
  options: Keychain.Options = {},
) {
  try {
    const item = await Keychain.getGenericPassword({
      service: storageKey,
      ...options,
    });
    if (!item) {
      return null;
    }
    return item.password;
  } catch (error) {
    console.log(TAG, 'Error retrieving stored item', error, true);
    // throw error
  }
}

/**
 * Removes an item from key chain storage given its storage key.
 * @param storageKey the keychain storage key.
 * @returns the status of the process.
 */
export async function removeStoredItem(storageKey: string) {
  try {
    return Keychain.resetGenericPassword({
      service: storageKey,
    });
  } catch (error) {
    console.log(TAG, 'Error clearing item', error, true);
    // throw error
  }
}

/**
 * Encrypts a value and stores it in keychain.
 * @param value the item to be stored.
 * @param password the encryption key of the item.
 * @param storageKey the storage key holding the item in storage.
 * @returns the status of the storage process.
 */
export async function storeEncryptedItem(
  value: string,
  password: string,
  storageKey: KeyChainKeys,
) {
  password = password.trim();
  value = value.trim();

  if (password === '' || value === '') {
    throw new Error(`Password or ${storageKey} can not be empty`);
  }

  // encrypt and store the mnemonic.
  const encryptedValue = await encryptPlainText(value, password);

  const storedItem = await storeItem(storageKey, encryptedValue, {});

  return storedItem;
}

/**
 * Retrieves and decrypts items stored in keychain given the storage key and the encryption key.
 * @param storageKey the keychain storage key
 * @param password the encryption key.
 * @returns the stored item in plain text.
 */
export async function getEncryptedItem(
  storageKey: KeyChainKeys,
  password: string,
) {
  try {
    const encryptedMnemonic = await retrieveStoredItem(storageKey);
    if (!encryptedMnemonic) {
      throw new Error('No mnemonic found in storage');
    }
    return decryptCypherText(encryptedMnemonic, password);
  } catch (error) {
    return null;
  }
}
