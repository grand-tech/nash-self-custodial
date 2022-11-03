import {ContractKit, newKitFromWeb3, StableToken} from '@celo/contractkit';
import Web3 from 'web3';

/**
 * Wakala contract kit.
 */
export default class NashContractKit {
  /**
   * Tag for logging and debugging purposes.
   */
  private TAG = '[ ' + this.constructor.name + '] : ';

  /**
   * Web3 instance..030
   */
  web3?: Web3 | any;

  kit?: ContractKit;

  static nashKit?: NashContractKit;

  /**
   * Gets a running instance of wakala contract kit utils.
   * @returns instance of wakala contract kit.
   */
  static getInstance() {
    if (!NashContractKit.nashKit) {
      // Create instance if it does not exist.
      NashContractKit.createInstance();
    }
    return NashContractKit.nashKit;
  }

  /**
   * Creates a singleton instance of wakala contract kit.
   * @param magic instance of magic provider.
   */
  static createInstance() {
    if (this.nashKit) {
      console.log(' instance already created!!');
    } else {
      let instance: NashContractKit = new NashContractKit();
      NashContractKit.nashKit = instance;
    }
  }

  /**
   * Destroy wakala contract kit instance.
   */
  static destroyInstance() {
    NashContractKit.nashKit = undefined;
  }

  /**
   * The users private key.
   * @param privateKey magic provider instance.
   */
  private constructor() {
    this.web3 = new Web3('https://alfajores-forno.celo-testnet.org');
    this.kit = newKitFromWeb3(this.web3);
  }

  /**
   * Adds an account to the custom contract kit.
   * @param privateKey the accounts private key.
   */
  public addAccount(privateKey: string) {
    this.kit?.connection.addAccount(privateKey);
  }

  /**
   * Removes accounts from the custom contract kit
   * @param address removes an account from the custom contract kit.
   */
  public removeAccount(address: string) {
    this.kit?.connection.removeAccount(address);
  }

  /**
   * Gets the current account balance.
   * @returns the current account`s balance.
   */
  async getCurrentAccountBalance(publicAddress: string) {
    return await this.kit?.getTotalBalance(publicAddress);
  }

  /**
   * Sends a certain amount of cUSD to a specified address.
   * @param recipientAddress the address receiving the funds
   * @param amount the number of tokens to be sent in wei.
   * @returns the transaction receipt.
   */
  async sendCUSD(
    senderAddress: string,
    recipientAddress: string,
    amount: number,
  ) {
    let cUSDToken =
      await NashContractKit.nashKit?.kit?.contracts.getStableToken(
        StableToken.cUSD,
      );
    let cUSDtx = await cUSDToken
      ?.transfer(recipientAddress, amount)
      .sendAndWaitForReceipt({
        from: senderAddress,
        feeCurrency: cUSDToken?.address,
      });
    return cUSDtx;
  }

  /**
   * Sends a certain amount of cEUR to a specified address.
   * @param recipientAddress the address receiving the funds
   * @param amount the number of tokens to be sent in wei.
   * @returns the transaction receipt.
   */
  async sendCEUR(
    senderAddress: string,
    recipientAddress: string,
    amount: number,
  ) {
    let cEURToken =
      await NashContractKit.nashKit?.kit?.contracts.getStableToken(
        StableToken.cEUR,
      );
    let cUSDtx = await cEURToken
      ?.transfer(recipientAddress, amount)
      .sendAndWaitForReceipt({
        from: senderAddress,
        feeCurrency: cEURToken?.address,
      });
    return cUSDtx;
  }

  /**
   * Sends a certain amount of cREAL to a specified address.
   * @param recipientAddress the address receiving the funds
   * @param amount the number of tokens to be sent in wei.
   * @returns the transaction receipt.
   */
  async sendCREAL(
    senderAddress: string,
    recipientAddress: string,
    amount: number,
  ) {
    let cREALToken =
      await NashContractKit.nashKit?.kit?.contracts.getStableToken(
        StableToken.cREAL,
      );
    let cUSDtx = await cREALToken
      ?.transfer(recipientAddress, amount)
      .sendAndWaitForReceipt({
        from: senderAddress,
        feeCurrency: cREALToken?.address,
      });
    return cUSDtx;
  }
}
