import bip39 from 'react-native-bip39';
import {
  MnemonicLanguages,
  invalidMnemonicWords,
  normalizeMnemonic,
  validateMnemonic,
  generateMnemonic,
  MnemonicStrength,
  generateKeys,
} from '@celo/cryptographic-utils/lib/account';
import {AccountInformation} from './interfaces';
import {
  storeEncryptedItem,
  KeyChainKeys,
  getEncryptedItem,
} from '../../../utils/session.key.storage.utils';
import {Result} from 'react-native-keychain';

/**
 * The number of words to be contained in the mnemonic.
 */
const MNEMONIC_BIT_LENGTH = MnemonicStrength.s256_24words;

/**
 * Checks if the mnemonic has duplicate words.
 */
const checkDuplicate = (someString: string) => {
  return new Set(someString.split(' ')).size !== someString.split(' ').length;
};

/**
 * Picks a the language to be used for mnemonic creation.
 */
export function getMnemonicLanguage(language: string | null) {
  switch (language?.slice(0, 2)) {
    case 'es': {
      return MnemonicLanguages.spanish;
    }
    case 'pt': {
      return MnemonicLanguages.portuguese;
    }
    default: {
      return MnemonicLanguages.english;
    }
  }
}

/**
 * Generates a new mnemonic for account creation.
 */
export async function generateNewMnemonic(): Promise<string> {
  const mnemonicLanguage = getMnemonicLanguage('');
  let mnemonic = await generateMnemonic(
    MNEMONIC_BIT_LENGTH,
    mnemonicLanguage,
    bip39,
  );

  let isDuplicateInMnemonic = checkDuplicate(mnemonic);
  while (isDuplicateInMnemonic) {
    mnemonic = await generateMnemonic(
      MNEMONIC_BIT_LENGTH,
      mnemonicLanguage,
      bip39,
    );
    isDuplicateInMnemonic = checkDuplicate(mnemonic);
  }

  return mnemonic;
}

/**
 * Creates a mnemonic and derives an account out of it.
 * @returns the private key.
 */
export async function createNewAccountWithMnemonic() {
  const mnemonic = await generateNewMnemonic();
  const keys = await getAccountFromMnemonic(mnemonic);
  const accountInfo: AccountInformation = {
    mnemonic: mnemonic,
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
    address: keys.address,
  };
  return accountInfo;
}

/**
 * Checks if a mnemonic is valid or not.
 * @param phrase the mnemonic to be validated.
 * @returns true if valid
 */
export function isMnemonicValid(phrase: string) {
  const normalizedPhrase = normalizeMnemonic(phrase);
  const phraseIsValid = validateMnemonic(normalizedPhrase, bip39);
  const invalidWords = phraseIsValid
    ? []
    : invalidMnemonicWords(normalizedPhrase);

  return phraseIsValid && !invalidWords;
}

/**
 * Creates an account given a mnemonic.
 * @param mnemonic the mnemonic string.
 */
export async function getAccountFromMnemonic(mnemonic: string) {
  const keys = await generateKeys(
    mnemonic,
    undefined,
    undefined,
    undefined,
    bip39,
  );
  const accountInfo: AccountInformation = {
    mnemonic: mnemonic,
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
    address: keys.address,
  };
  return accountInfo;
}

/**
 * Ret
 * @param mnemonic the mnemonic to be stored.
 * @param password the user password/pin.
 * @returns storage status (true if storage was successful).
 */
export async function storeEncryptedMnemonic(
  mnemonic: string,
  password: string,
) {
  let result: Result = await storeEncryptedItem(
    mnemonic,
    password,
    KeyChainKeys.MNEMONIC_STORAGE_KEY,
  );
  return result;
}

/**
 * Ret
 * @param   privateKey: string,
 the mnemonic to be stored.
 * @param password the user password/pin.
 * @returns storage status (true if storage was successful).
 */
export async function storeEncryptedPrivateKey(
  privateKey: string,
  password: string,
) {
  let result: Result = await storeEncryptedItem(
    privateKey,
    password,
    KeyChainKeys.PRIVATE_KEY_STORAGE_KEY,
  );
  return result;
}

/**
 * Retrieves the mnemonic stored in keychain.
 * @param pin the encryption password.
 * @returns the decrypted mnemonic stored.
 */
export async function getStoredMnemonic(pin: string) {
  let mnemonic: string | null = await getEncryptedItem(
    KeyChainKeys.MNEMONIC_STORAGE_KEY,
    pin,
  );
  return mnemonic;
}
