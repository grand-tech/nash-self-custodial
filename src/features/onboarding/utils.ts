import {ChipsInputChipProps} from 'react-native-ui-lib';
import {
  getEncryptedItem,
  KeyChainKeys,
} from '../../utils/session.key.storage.utils';

/**
 * Construct seed phrase from user`s input.
 * @returns constructed seed phrase from user input.
 */
export const constructSeedPhraseFromChipInputs = (
  inputSeedPhrase: ChipsInputChipProps[],
) => {
  let inputSeedPhraseStr = '';
  inputSeedPhrase.forEach((chip: ChipsInputChipProps) => {
    let label: string = chip.label ?? '';
    label = label.toLowerCase().trim();
    inputSeedPhraseStr = inputSeedPhraseStr + ' ' + label;
  });
  return inputSeedPhraseStr.trim();
};

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
