import {contractKit} from './contract.kit.utils';
import crashlytics from '@react-native-firebase/crashlytics';
import BigNumber from 'bignumber.js';

export interface WalletBalance {
  cUSD: number;
  CELO: number;
  cEUR: number;
  cREAL: number;
}

/**
 * Checks if account is new or has been used before.
 * @param address the accounts public address.
 * @returns true if account is new.
 */
export async function isAccountNew(address: string) {
  let balanceObject = await getBalance(address);
  for (const balance in balanceObject) {
    if (balanceObject[balance as keyof typeof balanceObject] > 0) {
      return false;
    }
  }
  return true;
}

/**
 * Gets the wallet balance and converts it to wei.
 * @returns the celo token balances in wei.
 */
export async function getBalance(address: string) {
  let bal: WalletBalance = {
    cUSD: 0,
    CELO: 0,
    cEUR: 0,
    cREAL: 0,
  };
  try {
    const balanceObj: Record<string, number> = {};
    // Get Balances
    let balances = await contractKit.celoTokens.balancesOf(address);
    // Convert and add to balance object

    for (const value in balances) {
      if (isKey(balances, value)) {
        let x = BigNumber(balances[value] ?? 0);
        x = x.dividedBy(10 ** 18);
        balanceObj[value] = x.toNumber();
      }
    }

    bal = {
      cUSD: balanceObj.cUSD,
      CELO: balanceObj.CELO,
      cEUR: balanceObj.cEUR,
      cREAL: balanceObj.cREAL,
    };
    return bal;
  } catch (err: any) {
    console.log(err);
    crashlytics().recordError(new Error(err), 'utils.getBalance()');
    return bal;
  }
}

/**
 * Checks if object obj contains a key key.
 * @param obj the object.
 * @param key the key to verify against.
 * @returns true if object
 */
export function isKey<T>(obj: T, key: PropertyKey): key is keyof T {
  return key in Object(obj);
}
