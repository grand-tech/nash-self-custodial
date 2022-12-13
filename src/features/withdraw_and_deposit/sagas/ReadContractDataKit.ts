import {ContractKit, newKitFromWeb3} from '@celo/contractkit';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import {NashCache} from '../../../utils/cache';
import {
  KARMA_CONTRACT_ADDRESS,
  NASH_CONTRACT_ADDRESS,
} from '../../../utils/smart_contracts/smart_contract_addresses';
import {KARMA_ABI} from '../../../utils/smart_contract_abis/KarmaAbi';
import {NashEscrowAbi} from '../../../utils/smart_contract_abis/NashEscrowAbi';
import {
  NashEscrowTransaction,
  TransactionType,
  NashTransaction,
} from './nash_escrow_types';

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

    // tracks the starting point for the search.
    if (
      NashCache.getRampPaginator() === NashCache.DEFAULT_RAMP_PAGINATOR_VALUE
    ) {
      let l =
        (await thisInst?.getNextTxIndex()) ??
        NashCache.DEFAULT_RAMP_PAGINATOR_VALUE;
      NashCache.setRampPaginator(l - 1);
      nashTxsArray = (await thisInst?.queryGetNextUnpairedTransactions()) ?? [];
    }

    return nashTxsArray;
  }

  /**
   * Fetches the transactions from the smart contract.
   */
  async fetchMyTransactions(statuses: number[], myAddress: string) {
    const thisInst = ReadContractDataKit.readDataContractKit;

    let nashTxsArray: Array<NashEscrowTransaction> = [];

    // tracks the starting point for the search.
    if (
      NashCache.getMyTransactionsRampPaginator() ===
      NashCache.DEFAULT_RAMP_PAGINATOR_VALUE
    ) {
      let l =
        (await thisInst?.getNextTxIndex()) ??
        NashCache.DEFAULT_RAMP_PAGINATOR_VALUE;
      if (l === 0) {
        return [];
      }
      NashCache.setMyTransactionsRampPaginator(l - 1);
      nashTxsArray =
        (await thisInst?.queryGetMyTransactions(statuses, myAddress)) ?? [];
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
    let nashTx = this.convertToNashTransactionObj(tx);
    return nashTx;
  }

  /**
   * Get transaction by index.
   */
  async queryGetNextUnpairedTransactions(): Promise<NashEscrowTransaction[]> {
    const tx = await this.nashEscrowContract?.methods
      .getTransactions(15, NashCache.getRampPaginator(), 0)
      .call();
    const txs: NashEscrowTransaction[] = [];
    for (let index = 0; index < tx.length; index++) {
      let nashTx = this.convertToNashTransactionObj(tx[index]);

      // update paginator.
      if (
        NashCache.getRampPaginator() ===
          NashCache.DEFAULT_RAMP_PAGINATOR_VALUE ||
        NashCache.getRampPaginator() > nashTx.id
      ) {
        NashCache.setRampPaginator(nashTx.id - 1);
      }

      // update the list of transactions.
      txs.push(nashTx);
    }

    return txs;
  }

  /**
   * Get transaction by index.
   */
  async queryGetMyTransactions(
    statuses: number[],
    myAddress: string,
  ): Promise<NashEscrowTransaction[]> {
    const tx = await this.nashEscrowContract?.methods
      .getMyTransactions(
        15,
        NashCache.getMyTransactionsRampPaginator(),
        statuses,
        myAddress,
      )
      .call();
    const txs: NashEscrowTransaction[] = [];
    for (let index = 0; index < tx.length; index++) {
      let nashTx = this.convertToNashTransactionObj(tx[index]);

      // update paginator.
      if (
        NashCache.getMyTransactionsRampPaginator() ===
          NashCache.DEFAULT_RAMP_PAGINATOR_VALUE ||
        NashCache.getMyTransactionsRampPaginator() > nashTx.id
      ) {
        NashCache.setMyTransactionsRampPaginator(nashTx.id - 1);
      }

      // update the list of transactions.
      txs.push(nashTx);
    }

    return txs;
  }

  /**
   * Convert response to nash transaction object.
   * @param tx the response object.
   * @returns the nash transaction object.
   */
  convertToNashTransactionObj(tx: string[]): NashEscrowTransaction {
    let txType = TransactionType.DEPOSIT;

    if (parseInt(tx[1], 10) === 1) {
      txType = TransactionType.WITHDRAWAL;
    }

    const nashTx: NashEscrowTransaction = {
      id: parseInt(tx[0], 10),
      txType: txType,
      clientAddress: tx[2],
      agentAddress: tx[3],
      status: parseInt(tx[4], 10),
      netAmount: Number(this.kit?.web3.utils.fromWei(tx[5], 'ether')),
      agentFee: Number(this.kit?.web3.utils.fromWei(tx[6], 'ether')),
      nashFee: Number(this.kit?.web3.utils.fromWei(tx[7], 'ether')),
      grossAmount: Number(this.kit?.web3.utils.fromWei(tx[8], 'ether')),
      agentApproval: tx[9],
      clientApproval: tx[10],
      agentPaymentDetails: tx[11],
      clientPaymentDetails: tx[12],
    };

    return nashTx;
  }

  /**
   * Convert response to nash transaction object.
   * @param txs the list of transactions.
   * @returns the nash transaction object.
   */
  convertToNashTransactions(txs: NashTransaction[]): NashEscrowTransaction[] {
    const list: NashEscrowTransaction[] = [];
    txs.forEach((tx: NashTransaction) => {
      const nashTx: NashEscrowTransaction = {
        id: tx.index,
        txType: tx.txType,
        clientAddress: tx.clientAddress,
        agentAddress: tx.agentAddress,
        status: tx.status,
        netAmount: Number(
          this.kit?.web3.utils.fromWei(tx.netAmount.toString(), 'ether'),
        ),
        agentFee: Number(
          this.kit?.web3.utils.fromWei(tx.agentFee.toString(), 'ether'),
        ),
        nashFee: Number(
          this.kit?.web3.utils.fromWei(tx.nashFee.toString(), 'ether'),
        ),
        grossAmount: Number(
          this.kit?.web3.utils.fromWei(tx.grossAmount.toString(), 'ether'),
        ),
        agentApproval: tx.agentApproval,
        clientApproval: tx.clientApproval,
        agentPaymentDetails: tx.agentPaymentDetails,
        clientPaymentDetails: tx.clientPaymentDetails,
      };
      list.push(nashTx);
    });

    return list;
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
//       agentPaymentDetails: tx[13],
//       clientPaymentDetails: tx[14],
