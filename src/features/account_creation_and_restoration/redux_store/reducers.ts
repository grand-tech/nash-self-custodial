import {Actions, ActionTypes} from './actions';

interface OnboardingState {
  language: string;
  encryptedPrivateKey: boolean;
  verifiedMnemonicBackup: boolean;
  publicAddress: string;
  publicKey: string;
  status: 'create new account' | 'restore account' | 'onboarding complete' | '';
  value: number; // remove this later.
}

const initialState: OnboardingState = {
  language: '',
  encryptedPrivateKey: false,
  verifiedMnemonicBackup: false,
  publicAddress: '',
  publicKey: '',
  status: '',
  value: 0,
};

export const onBoardingReducer = (
  state: OnboardingState | undefined = initialState,
  action: ActionTypes,
): OnboardingState => {
  switch (action.type) {
    case Actions.INCREMENT:
      let v = state.value + 1;
      return {
        ...state,
        value: v,
      };
    case Actions.DECREMENT:
      let x = state.value - 1;
      return {
        ...state,
        value: x,
      };
    case Actions.INCREMENT_BY_AMOUNT:
      let y = state.value + action.amount;
      return {
        ...state,
        value: y,
      };
    case Actions.INCREMENT_BY_AMOUNT:
      let z = state.value + action.amount;
      return {
        ...state,
        value: z,
      };
    case Actions.INCREMENT_ASYNC_COMPLETE:
      return {
        ...state,
        value: action.result,
      };

    default:
      return state;
  }
};
