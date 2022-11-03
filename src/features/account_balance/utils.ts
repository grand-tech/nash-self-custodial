import NashContractKit from './contract.kit.utils';

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
    let balances =
      await NashContractKit.getInstance()?.kit?.celoTokens.balancesOf(address);
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

// export async function dummySendFunds() {
//   let publicAddress = '0xA29644866836a396a14D5366A8b4F57975c0BC58';
//   let privateKey =
//     '31b45a2ef002b738202b1399ae67959ac7180d32f21dea7e6d7fa49e4c9ec443';
//   let celotoken = await kit.contracts.getGoldToken();
//   let cUSDtoken = await kit.contracts.getStableToken();

//   kit.connection.addAccount(privateKey);

//   const amount = 1000000;

//   const anAddress = '0x4f735D13d9Fb715480F81599dE4248C80c1d137e';

//   let celotx = await celotoken
//     .transfer(anAddress, amount)
//     .send({from: publicAddress, feeCurrency: cUSDtoken.address});
//   // let cUSDtx = await cUSDtoken
//   //   .transfer(anAddress, amount)
//   //   .send({from: publicAddress, feeCurrency: cUSDtoken.address});
//   // let cEURtx = await cEURtoken
//   //   .transfer(anAddress, amount)
//   //   .send({from: publicAddress});
//   // let cUSDReceipt = await cUSDtx.waitReceipt();
//   // let cEURReceipt = await cEURtx.waitReceipt();

//   let celoReceipt = await celotx.waitReceipt();

//   console.log('CELO Transaction receipt: %o', celoReceipt);

//   let celoBalance = await celotoken.balanceOf(publicAddress);
//   let cUSDBalance = await cUSDtoken.balanceOf(publicAddress);

//   console.log(`Your new account CELO balance: ${celoBalance.toString()}`);
//   console.log(`Your new account Mento cUSD balance: ${cUSDBalance.toString()}`);
// }
