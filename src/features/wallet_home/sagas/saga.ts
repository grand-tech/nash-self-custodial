import {StableToken} from '@celo/contractkit';
import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {ActionSendFunds} from '../redux_store/actions';
import NashContractKit from '../../account_balance/contract.kit.utils';
import {getStoredPrivateKey} from '../../onboarding/utils';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {Actions} from '../redux_store/actions';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';

export function* watchSendFunds() {
  yield takeLatest(Actions.SEND_FUNDS, sendFunds);
}

export function* sendFunds(action: ActionSendFunds) {
  const contractKit: NashContractKit = yield call(NashContractKit.getInstance);
  const amount = contractKit.kit?.web3?.utils.toWei(action.amount.toString());
  const coin = action.coin;

  const privateKey: string = yield call(getStoredPrivateKey, '202222');
  const address: string = yield select(selectPublicAddress);

  contractKit.kit?.addAccount(privateKey);
  try {
    if (coin === StableToken.cUSD) {
      const receipt = yield call(
        contractKit.sendCUSD,
        address,
        action.recipientAddress,
        amount,
      );
      console.log(receipt);
      yield put(generateActionQueryBalance());
    } else if (coin === StableToken.cREAL) {
      const receipt = yield call(
        contractKit.sendCREAL,
        address,
        action.recipientAddress,
        amount,
      );
      console.log(receipt);
      yield put(generateActionQueryBalance());
    } else if (coin === StableToken.cEUR) {
      const receipt = yield call(
        contractKit.sendCEUR,
        address,
        action.recipientAddress,
        amount,
      );
      console.log(receipt);
      yield put(generateActionQueryBalance());
    }
  } catch (error: any) {
    console.log(error);
  }
}

export function* walletSagas() {
  yield spawn(watchSendFunds);
}
