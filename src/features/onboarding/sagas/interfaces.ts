/**
 * Account information.
 * @typedef {Object} AccountInformation properties crypto account.
 * @property { string} mnemonic the components to be rendered on the constructed screen.
 * @property { string } privateKey the account`s private key.
 * @property { string } publicKey the account`s public key.
 * @property { string } address the account`s public address.
 */
export interface AccountInformation {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
}
