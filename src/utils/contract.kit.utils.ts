import {ContractKit, newKitFromWeb3, StableToken} from '@celo/contractkit';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {NashEscrowAbi} from './smart_contract_abis/NashEscrowAbi';
import {AbiItem} from 'web3-utils';
import BigNumber from 'bignumber.js';
import {CeloTxObject} from '@celo/connect';
import Config from 'react-native-config';
import {GasEstimate} from './gas.fees.sagas';

export let web3: Web3;

export let contractKit: ContractKit;

export let nashEscrow: Contract;

// const TAG = '[Contract Kit Utils]';

export function initializeContractKit() {
  if (!web3) {
    web3 = new Web3(Config.CELO_NETWORK_URL ?? '');
  }

  if (!contractKit) {
    contractKit = newKitFromWeb3(web3);
  }

  if (!nashEscrow) {
    nashEscrow = new web3.eth.Contract(
      NashEscrowAbi as AbiItem[],
      Config.NASH_CONTRACT_ADDRESS,
    );
    console.log('initContractKit');
  }
}

/**
 * Adds an account to the custom contract contractKit.
 * @param privateKey the accounts private key.
 */
export function addAccount(privateKey: string) {
  contractKit.connection.addAccount(privateKey);
}

/**
 * Get an instance of nash escrow smart contract.
 */
export function getNashEscrow() {
  return nashEscrow;
}

/**
 * Gets the current account balance.
 * @returns the current account`s balance.
 */
export async function getCurrentAccountBalance(publicAddress: string) {
  return await contractKit.getTotalBalance(publicAddress);
}

/**
 * Sends a certain amount of cUSD to a specified address.
 * @param senderAddress the senders address.
 * @param recipientAddress the address receiving the funds
 * @param amount the number of tokens to be sent in wei.
 * @returns the transaction receipt.
 */
export async function sendCUSD(
  senderAddress: string,
  recipientAddress: string,
  amount: string,
) {
  let cUSDToken = await contractKit.contracts.getStableToken(StableToken.cUSD);
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
 * @param senderAddress the senders address.
 * @param recipientAddress the address receiving the funds
 * @param amount the number of tokens to be sent in wei.
 * @returns the transaction receipt.
 */
export async function sendCEUR(
  senderAddress: string,
  recipientAddress: string,
  amount: string,
) {
  let cEURToken = await contractKit.contracts.getStableToken(StableToken.cEUR);
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
 * @param senderAddress the senders address.
 * @param recipientAddress the address receiving the funds
 * @param amount the number of tokens to be sent in wei.
 * @returns the transaction receipt.
 */
export async function sendCREAL(
  senderAddress: string,
  recipientAddress: string,
  amount: string,
) {
  let cREALToken = await contractKit.contracts.getStableToken(
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
export async function sendTransactionObject(
  txObject: CeloTxObject<any>,
  senderAccount: string,
  gasEstimate: GasEstimate,
) {
  let txResult = await contractKit.sendTransactionObject(txObject, {
    from: senderAccount,
    feeCurrency: gasEstimate.token,
    gasPrice: gasEstimate.gasFees,
  });

  let receipt = await txResult.waitReceipt();
  return receipt;
}

/**
 * Approve the nash to use a certain amount of cUSD from the users.
 * @param coin the stable token to be approved.
 * @param _amount the amount that can be used by a smart contract.
 * @param account the address of the sender.
 * @returns approval receipt.
 */
export async function stableTokenApproveAmount(
  coin: StableToken,
  _amount: number,
  account: string,
) {
  const amount = contractKit.web3.utils.toWei((_amount + 1).toString()) ?? '';
  let cUSD = await contractKit.contracts.getStableToken(coin);

  let tx;
  if (_amount === 0) {
    tx = cUSD.decreaseAllowance(Config.NASH_CONTRACT_ADDRESS ?? '', '0');
  } else {
    tx = cUSD.approve(Config.NASH_CONTRACT_ADDRESS ?? '', amount);
  }

  const receipt = tx.sendAndWaitForReceipt({
    from: account,
    feeCurrency: cUSD.address,
  });
  return receipt;
}
