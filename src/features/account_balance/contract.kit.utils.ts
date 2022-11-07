import {ContractKit, newKitFromWeb3, StableToken} from '@celo/contractkit';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {
  ERC20_ADDRESS,
  NASH_CONTRACT_ADDRESS,
} from '../../utils/smart_contracts/smart_contract_addresses';
import {NashEscrowAbi} from '../../utils/smart_contract_abis/NashEscrowAbi';
import {AbiItem} from 'web3-utils';
import BigNumber from 'bignumber.js';
import {plugins} from '../../../babel.config';

/**
 * Nash contract kit.
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

  nashEscrow: Contract;

  /**
   * Gets a running instance of nash contract kit utils.
   * @returns instance of nash contract kit.
   */
  static getInstance() {
    if (!NashContractKit.nashKit) {
      // Create instance if it does not exist.
      NashContractKit.createInstance();
    }
    return NashContractKit.nashKit;
  }

  /**
   * Creates a singleton instance of nash contract kit.
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
   * Destroy nash contract kit instance.
   */
  static destroyInstance() {
    NashContractKit.nashKit = undefined;
  }

  /**
   * The users private key.
   */
  private constructor() {
    this.web3 = new Web3('https://alfajores-forno.celo-testnet.org');
    this.kit = newKitFromWeb3(this.web3);
    this.nashEscrow = new this.web3.eth.Contract(
      NashEscrowAbi as AbiItem[],
      NASH_CONTRACT_ADDRESS,
    );
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
   * Get an instance of nashh escrow smart contract.
   */
  public getNashEscrow() {
    return this.nashEscrow;
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

  /**
   * Signs and sends the composed transaction object.
   * @param txObject the transaction object.
   * @returns receipt.
   */
  static async sendTransactionObject(txObject: any, senderAccount: string) {
    const gasPrice =
      (await NashContractKit.getInstance()?.fetchGasPrice(ERC20_ADDRESS)) ?? '';
    let tx = await NashContractKit.getInstance()?.kit?.sendTransactionObject(
      txObject,
      {
        from: senderAccount,
        feeCurrency: ERC20_ADDRESS,
        gasPrice: gasPrice.toString(),
      },
    );

    let receipt = await tx?.waitReceipt();
    return receipt;
  }

  /**
   * Approve the wakala to use a certain amount of cUSD from the users.
   * @param _amount the amount that can be used by a smart contract.
   * @param account the address of the sender.
   * @returns approval receipt.
   */
  static async cUSDApproveAmount(_amount: number, account: string) {
    console.log('amount ====>', _amount);
    const amount =
      NashContractKit.nashKit?.kit?.web3.utils.toWei(
        (_amount + 1).toString(),
      ) ?? '';
    console.log('amount ====>', amount);
    let cUSD = await NashContractKit.nashKit?.kit?.contracts.getStableToken(
      StableToken.cUSD,
    );

    let tx;
    if (_amount === 0) {
      tx = cUSD?.decreaseAllowance(NASH_CONTRACT_ADDRESS, '0');
    } else {
      tx = cUSD?.approve(NASH_CONTRACT_ADDRESS, amount);
    }

    const receipt = tx?.sendAndWaitForReceipt({
      from: account,
      feeCurrency: cUSD?.address,
    });
    const allowance = await cUSD?.allowance(account, NASH_CONTRACT_ADDRESS);
    console.log('allowance', allowance);
    return receipt;
  }

  /**
   * Fetch gas fees estimate.
   * @param tokenAddress token used as gas fees (at this point still using CELO).
   * @returns the gas price estimate.
   */
  async fetchGasPrice(tokenAddress: string): Promise<BigNumber> {
    const gasPriceMinimum = await this.kit?.contracts.getGasPriceMinimum();
    const latestGasPrice = await gasPriceMinimum?.getGasPriceMinimum(
      tokenAddress,
    );
    const inflatedGasPrice = latestGasPrice?.times(5) ?? new BigNumber(0);
    return inflatedGasPrice;
  }
}
