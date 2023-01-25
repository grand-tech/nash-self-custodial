import {StableToken} from '@celo/contractkit';
import {call, put, select, spawn, takeLatest} from 'redux-saga/effects';
import {ActionSendFunds} from '../redux_store/actions';
import {generateActionQueryBalance} from '../../account_balance/redux_store/action.generators';
import {Actions} from '../redux_store/actions';
import {selectPublicAddress} from '../../onboarding/redux_store/selectors';
import {generateActionSetSuccess} from '../../ui_state_manager/action.generators';
import {generateActionSetError} from '../../ui_state_manager/action.generators';
import {CeloTxReceipt} from '@celo/connect';
import {
  contractKit,
  sendCEUR,
  sendCREAL,
  sendCUSD,
  web3,
} from '../../account_balance/contract.kit.utils';
import {NashCache} from '../../../utils/cache';
import crashlytics from '@react-native-firebase/crashlytics';

export function* watchSendFunds() {
  yield takeLatest(Actions.SEND_FUNDS, sendFunds);
}

export function* sendFunds(action: ActionSendFunds) {
  const amount = web3.utils.toWei(action.amount.toString());
  const coin = action.coin;

  const privateKey: string = NashCache.getPrivateKey();
  const address: string = yield select(selectPublicAddress);

  contractKit.addAccount(privateKey);
  try {
    if (coin === StableToken.cUSD) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const receipt: CeloTxReceipt = yield call(
        sendCUSD,
        address,
        action.recipientAddress,
        amount,
      );
    } else if (coin === StableToken.cREAL) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const receipt: CeloTxReceipt = yield call(
        sendCREAL,
        address,
        action.recipientAddress,
        amount,
      );
    } else if (coin === StableToken.cEUR) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const receipt: CeloTxReceipt = yield call(
        sendCEUR,
        address,
        action.recipientAddress,
        amount,
      );
    }
    yield put(generateActionSetSuccess('Transaction successful.'));
    yield put(generateActionQueryBalance());
  } catch (error: any) {
    crashlytics().recordError(
      new Error(error),
      '[SAGA] sendFunds' + error.name,
    );
    console.log(error);
    yield put(generateActionSetError(error.toString(), error.message));
  }
}

export function* walletSagas() {
  yield spawn(watchSendFunds);
}
