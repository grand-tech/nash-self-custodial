import {StableToken} from '@celo/contractkit';
export type WalletHomeNavigationStackParamsList = {
  WalletHomeScreen: undefined;
  RequestMoney: undefined;
  SendMoney: {address: string};
  EnterAddressScreen: undefined;
  ReviewSendTransaction: {
    address: string;
    amount: number;
    coin: StableToken;
  };
};
