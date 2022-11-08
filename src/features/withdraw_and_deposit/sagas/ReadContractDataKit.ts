import {ContractKit, newKitFromWeb3} from '@celo/contractkit';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import {
  KARMA_CONTRACT_ADDRESS,
  NASH_CONTRACT_ADDRESS,
} from '../../../utils/smart_contracts/smart_contract_addresses';
import {KARMA_ABI} from '../../../utils/smart_contract_abis/KarmaAbi';
import {NashEscrowAbi} from '../../../utils/smart_contract_abis/NashEscrowAbi';
import {NashEscrowTransaction, TransactionType} from './nash_escrow_types';

/**
 * Nash contract kit.
 */
export default class ReadContractDataKit {
  /**
   * Tag for logging and debugging purposes.
   */
  private TAG = '[ ' + this.constructor.name + '] : ';

  /**
   * Private instance of the nash contract kit class.
   */
  private static readDataContractKit?: ReadContractDataKit;

  /**
   * Web3 instance.
   */
  web3?: Web3 | any;

  /**
   * Instance of nash escrow smart contract.
   */
  nashEscrowContract?: Contract;

  /**
   * Instance of karma protocol smart contract.
   */
  karmaContract?: Contract;

  kit?: ContractKit;

  /**
   * Gets a running instance of nash contract kit utils.
   * @returns instance of nash contract kit.
   */
  static getInstance() {
    if (ReadContractDataKit.readDataContractKit) {
      ReadContractDataKit.createInstance();
    }
    return ReadContractDataKit.readDataContractKit;
  }

  /**
   * Creates a singleton instance of nash contract kit.
   */
  static createInstance() {
    if (typeof ReadContractDataKit.readDataContractKit === 'undefined') {
      console.log('create read instance');
      ReadContractDataKit.readDataContractKit = new ReadContractDataKit();
    }
  }

  /**
   * The users private key.
   */
  private constructor() {
    // console.log("configs.CONTRACT_KIT_URI!", configs.CONTRACT_KIT_URI!);
    // this.web3 = new Web3(configs.CONTRACT_KIT_URI!);
    this.web3 = new Web3('https://alfajores-forno.celo-testnet.org');

    this.nashEscrowContract = new this.web3.eth.Contract(
      NashEscrowAbi as AbiItem[],
      NASH_CONTRACT_ADDRESS,
    );

    this.karmaContract = new this.web3.eth.Contract(
      KARMA_ABI as AbiItem[],
      KARMA_CONTRACT_ADDRESS,
    );
    this.kit = newKitFromWeb3(this.web3);
  }

  /**
   * Gets the current account balance.
   * @returns the current account`s balance.
   */
  async getCurrentAccountBalance(publicAddress: string) {
    return await this.kit?.getTotalBalance(publicAddress);
  }

  /**
   * Fetches the transactions from the smart contract.
   */
  async fetchTransactions() {
    const thisInst = ReadContractDataKit.readDataContractKit;

    let nashTxsArray: Array<NashEscrowTransaction> = [];
    let l = await thisInst?.getNextTxIndex();

    // tracks the starting point for the search.
    if (l) {
      let currentQueryTx = l - 1;
      for (let index = 0; index < 16; index++) {
        let tx = await thisInst?.queryGetNextUnpairedTransaction(
          currentQueryTx,
        );

        if (tx && tx?.netAmount !== 0) {
          nashTxsArray.push(tx);
        } else {
          // exit loop (no next tsx)
          return nashTxsArray;
        }

        // exit loop (no next tsx)
        if (tx.id === 0) {
          return nashTxsArray;
        }

        // set the next starting point for the smart contract loop.
        currentQueryTx = tx.id - 1;
      }
    }

    return nashTxsArray;
  }

  /**
   * Get transaction by index.
   */
  async getNextTxIndex(): Promise<number> {
    const txIndexResp = await this.nashEscrowContract?.methods
      .getNextTransactionIndex()
      .call();
    return parseInt(txIndexResp, 10);
  }

  /**
   * Get transaction by index.
   */
  async queryTransactionByIndex(index: number): Promise<NashEscrowTransaction> {
    const tx = await this.nashEscrowContract?.methods
      .getTransactionByIndex(index)
      .call();
    let nashTx = await this.convertToNashTransactionObj(tx);
    return nashTx;
  }

  /**
   * Get transaction by index.
   */
  async queryGetNextUnpairedTransaction(
    id: number,
  ): Promise<NashEscrowTransaction> {
    const tx = await this.nashEscrowContract?.methods
      .getNextUnpairedTransaction(id)
      .call();
    let nashTx = await this.convertToNashTransactionObj(tx);
    return nashTx;
  }

  /**
   * Convert response to nash transaction object.
   * @param tx the response object.
   * @returns the nash transaction object.
   */
  convertToNashTransactionObj(tx: string[]): NashEscrowTransaction {
    const nashTx: NashEscrowTransaction = {
      id: parseInt(tx[0], 10),
      txType: TransactionType[parseInt(tx[1], 10)],
      clientAddress: tx[2],
      agentAddress: tx[3],
      status: parseInt(tx[4], 10),
      netAmount: Number(this.kit?.web3.utils.fromWei(tx[5], 'ether')),
      agentFee: Number(this.kit?.web3.utils.fromWei(tx[6], 'ether')),
      nashFee: Number(this.kit?.web3.utils.fromWei(tx[7], 'ether')),
      grossAmount: Number(this.kit?.web3.utils.fromWei(tx[8], 'ether')),
      agentApproval: tx[9],
      clientApproval: tx[10],
      agentPhoneNumber: tx[11],
      clientPhoneNumber: tx[12],
    };

    return nashTx;
  }
}

// id: parseInt(tx[0], 10),
//       txType: TransactionType[parseInt(tx[1], 10)],
//       clientAddress: tx[2],
//       agentAddress: tx[3],
//       status: parseInt(tx[4], 10),
//       netAmount: Number(this.kit?.web3.utils.fromWei(tx[5], 'ether')),
//       cryptoFiatConversionRate: tx[6],
//       fiatCurrencyCode: tx[7],
//       agentFee: Number(this.kit?.web3.utils.fromWei(tx[8], 'ether')),
//       nashFee: Number(this.kit?.web3.utils.fromWei(tx[9], 'ether')),
//       grossAmount: Number(this.kit?.web3.utils.fromWei(tx[10], 'ether')),
//       agentApproval: tx[11],
//       clientApproval: tx[12],
//       agentPhoneNumber: tx[13],
//       clientPhoneNumber: tx[14],
