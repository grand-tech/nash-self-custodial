import CryptoJS from 'crypto-js';

/**
 * Encrypt plain text.
 * @param plainText the mnemonic.
 * @param password the password used to encrypt the mnemonic.
 * @returns the encrypted mnemonic.
 */
export async function encryptPlainText(plainText: string, password: string) {
  const encryptedMnemonic = CryptoJS.AES.encrypt(
    plainText,
    password,
  ).toString();
  return encryptedMnemonic;
}

/**
 * Decrypts the cypher text given the encryption key.
 * @param cypher encrypted string.
 * @param password password used to decrypt the mnemonic.
 * @returns the decrypted cypher text.
 */
export async function decryptCypherText(cypher: string, password: string) {
  const bytes = CryptoJS.AES.decrypt(cypher, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}
