import {
  ActionConfirmedSeedPhrase,
  ActionRestoreExistingAccount,
  ActionChooseCreateNewAccount,
  ActionChooseRestoreExistingAccount,
  ActionCreateNewAccount,
  Actions,
  ActionSelectedLanguage,
  ActionSetUserName,
  ActionAdoptedNewAccount,
  ActionAdoptNewAccount,
  ActionCompletedOnboarding,
  ActionLogOut,
} from './actions';

/**
 * Generates select language action.
 * @param language the selected language action.
 * @returns the select language action.
 */
export function selectLanguage(language: string): ActionSelectedLanguage {
  return {
    type: Actions.SELECTED_LANGUAGE,
    language: language,
  };
}

/**
 * Generates choose new account action.
 * @returns choose create new account action.
 */
export function chooseCreateNewAccount(): ActionChooseCreateNewAccount {
  return {
    type: Actions.CHOOSE_CREATE_NEW_ACCOUNT,
  };
}

/**
 * Set user name action.
 * @param userName the user name.
 * @returns set user name action.
 */
export function setUserName(userName: string): ActionSetUserName {
  return {
    type: Actions.SET_USER_NAME,
    userName: userName,
  };
}

/**
 * Generates restore existing account action
 * @returns choose restore existing account actions.
 */
export function chooseRestoreExistingAccount(): ActionChooseRestoreExistingAccount {
  return {
    type: Actions.CHOOSE_RESTORE_EXISTING_ACCOUNT,
  };
}

/**
 * Generates create new account action.
 * @param pin the users pin number.
 * @returns create new account action.
 */
export function createNewAccountAction(pin: string): ActionCreateNewAccount {
  return {
    type: Actions.CREATE_NEW_ACCOUNT,
    pin: pin,
  };
}

/**
 * Generates created new account action.
 * @param address the users public address.
 * @param publicKey the users public key.
 * @returns created new account action obj.
 */
export function generateActionAdoptedNewAccount(
  address: string,
  publicKey: string,
): ActionAdoptedNewAccount {
  return {
    type: Actions.ADOPTED_NEW_ACCOUNT,
    publicAddress: address,
    publicKey: publicKey,
  };
}

/**
 * Generates created new account action.
 * @param pin the users pin number.
 * @returns adopt new account action obj.
 */
export function generateActionAdoptNewAccount(
  pin: string,
): ActionAdoptNewAccount {
  return {
    type: Actions.ADOPT_NEW_ACCOUNT,
    pin: pin,
  };
}

/**
 * Generates completed onboarding action.
 * @returns completed onboarding action obj.
 */
export function generateActionCompletedOnboarding(): ActionCompletedOnboarding {
  return {
    type: Actions.COMPLETED_ONBOARDING,
  };
}

/**
 * Generates completed onboarding action.
 * @returns completed onboarding action obj.
 */
export function generateActionConfirmedSeedPhrase(): ActionConfirmedSeedPhrase {
  return {
    type: Actions.CONFIRMED_SEED_PHRASE,
  };
}

/**
 * Generates completed onboarding action.
 * @returns completed onboarding action obj.
 */
export function generateActionRestoreExistingAccount(
  pin: string,
  mnemonic: string,
): ActionRestoreExistingAccount {
  return {
    type: Actions.RESTORE_EXISTING_ACCOUNT,
    pin: pin,
    mnemonic: mnemonic,
  };
}

export function generateActionLogout(): ActionLogOut {
  return {
    type: Actions.LOG_OUT,
  };
}
