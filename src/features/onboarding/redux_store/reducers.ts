import {Actions, ActionTypes} from './actions';

/**
 * Onboarding state object.
 */
interface OnboardingState {
  language: string;
  storedEncryptedPrivateKey: boolean;
  verifiedMnemonicBackup: boolean;
  publicAddress: string;
  publicKey: string;
  user_name: string;
  status: 'create_new_account' | 'restore_account' | 'onboarding_complete' | '';
}

/**
 * Initial state.
 */
const initialState: OnboardingState = {
  language: '',
  storedEncryptedPrivateKey: false,
  verifiedMnemonicBackup: false,
  publicAddress: '',
  publicKey: '',
  user_name: '',
  status: '',
};

export const onBoardingReducer = (
  state: OnboardingState | undefined = initialState,
  action: ActionTypes,
): OnboardingState => {
  switch (action.type) {
    case Actions.SELECTED_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case Actions.CREATED_ACCOUNT:
      return {
        ...state,
        publicAddress: action.publicAddress,
        publicKey: action.publicKey,
      };
    case Actions.CHOOSE_CREATE_NEW_ACCOUNT:
      return {
        ...state,
        status: 'create_new_account',
      };
    case Actions.CHOOSE_RESTORE_EXISTING_ACCOUNT:
      return {
        ...state,
        status: 'restore_account',
      };
    case Actions.COMPLETED_ONBOARDING:
      return {
        ...state,
        status: 'onboarding_complete',
      };
    case Actions.SET_USER_NAME:
      return {
        ...state,
        user_name: action.userName,
      };
    default:
      return state;
  }
};
