import {contractKit} from './contract.kit.utils';
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
      balanceObj[value] = balances[value] / 10 ** 18;
    }

    bal = {
      cUSD: balanceObj.cUSD,
      CELO: balanceObj.CELO,
      cEUR: balanceObj.cEUR,
      cREAL: balanceObj.cREAL,
    };
    return bal;
  } catch (err) {
    console.log(err);
    return bal;
  }
}
