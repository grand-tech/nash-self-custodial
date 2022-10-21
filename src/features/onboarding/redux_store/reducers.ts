import {Actions, ActionTypes} from './actions';

/**
 * List of values expected on the onboarding status name.
 */
export enum OnboardingStatusNames {
  choose_create_new_account = 'choose_create_new_account',
  creating_new_account = 'creating_new_account',
  created_new_account = 'created_new_account',
  choose_restore_account = 'choose_restore_account',
  restoring_account = 'restoring_account',
  restored_account = 'restored_account',
  error_restoring_account = 'error_restoring_account',
  onboarding_complete = 'onboarding_complete',
  undefined = '',
}

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
  status: {
    name: OnboardingStatusNames;
    error: any | undefined;
  };
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
  status: {
    name: OnboardingStatusNames.undefined,
    error: undefined,
  },
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
    case Actions.ADOPTED_NEW_ACCOUNT:
      return {
        ...state,
        publicAddress: action.publicAddress,
        publicKey: action.publicKey,
        status: {
          name: OnboardingStatusNames.created_new_account,
          error: undefined,
        },
      };
    case Actions.CHOOSE_CREATE_NEW_ACCOUNT:
      return {
        ...state,
        status: {
          name: OnboardingStatusNames.choose_create_new_account,
          error: undefined,
        },
      };
    case Actions.CHOOSE_RESTORE_EXISTING_ACCOUNT:
      return {
        ...state,
        status: {
          name: OnboardingStatusNames.choose_restore_account,
          error: undefined,
        },
      };
    case Actions.COMPLETED_ONBOARDING:
      return {
        ...state,
        status: {
          name: OnboardingStatusNames.onboarding_complete,
          error: undefined,
        },
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
