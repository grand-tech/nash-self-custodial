import {StableToken} from '@celo/contractkit';
import {contractKit} from '../contract.kit.utils';
import {CUSDEventListeners} from './CUSDEventListeners';
import {NashContractEventsKit} from './NashContractEventsKit';
import {CEUROventListeners} from './CEUROventListeners';
import {CREALEventListeners} from './CREALEventListeners';

/**
 * Starts all smart contract event listeners.
 */
export async function startSmartContractEventLiteners() {
  // Nash smart contract address.
  NashContractEventsKit.createInstance();

  // Get the smart contract addresses.
  const cUSDAddress = await contractKit.contracts.getStableToken(
    StableToken.cUSD,
  );
  const cEURAddress = await contractKit.contracts.getStableToken(
    StableToken.cEUR,
  );
  const cREALAddress = await contractKit.contracts.getStableToken(
    StableToken.cREAL,
  );
  CUSDEventListeners.createInstance(cUSDAddress.address);
  CEUROventListeners.createInstance(cEURAddress.address);
  CREALEventListeners.createInstance(cREALAddress.address);
}
