export enum Actions {
  SELECTED_LANGUAGE = 'ONBOARDING/SELECTED_LANGUAGE',
  CHOOSE_CREATE_NEW_ACCOUNT = 'ONBOARDING/CHOOSE_CREATE_NEW_ACCOUNT',
  CREATE_NEW_ACCOUNT = 'ONBOARDING/CREATE_NEW_ACCOUNT',
  CREATED_NEW_ACCOUNT = 'ONBOARDING/CREATED_NEW_ACCOUNT',
  CHOOSE_RESTORE_EXISTING_ACCOUNT = 'ONBOARDING/CHOOSE_RESTORE_EXISTING_ACCOUNT',
  SET_USER_NAME = 'ONBOARDING/SET_USER_NAME',
  COMPLETED_ONBOARDING = 'ONBOARDING/COMPLETED_ONBOARDING',
  CREATED_ACCOUNT = 'ONBOARDING/CREATED_ACCOUNT',
  ENCRYPTED_PRIVATE_KEY = 'ONBOARDING/ENCRYPTED_PRIVATE_KEY',
  STORE_PRIVATE_KEY = 'ONBOARDING/STORE_PRIVATE_KEY',
  STORED_PRIVATE_KEY = 'ONBOARDING/STORED_PRIVATE_KEY',
  CONFIRM_SEED_PHRASE = 'ONBOARDING/CONFIRM_SEED_PHRASE',
}

export interface ActionSelectedLanguage {
  type: Actions.SELECTED_LANGUAGE;
  language: string;
}

export interface ActionCreateNewAccount {
  type: Actions.CREATE_NEW_ACCOUNT;
  pin: string;
}

export interface ActionCreatedNewAccount {
  type: Actions.CREATED_NEW_ACCOUNT;
  publicKey: string;
  publicAddress: string;
}

export interface ActionChooseCreateNewAccount {
  type: Actions.CHOOSE_CREATE_NEW_ACCOUNT;
}

export interface ActionSetUserName {
  type: Actions.SET_USER_NAME;
  userName: string;
}

export interface ActionEncryptedPrivateKey {
  type: Actions.ENCRYPTED_PRIVATE_KEY;
}

export interface ActionStorePrivateKey {
  type: Actions.STORE_PRIVATE_KEY;
}

export interface ActionStoredPrivateKey {
  type: Actions.STORED_PRIVATE_KEY;
}

export interface ActionChooseRestoreExistingAccount {
  type: Actions.CHOOSE_RESTORE_EXISTING_ACCOUNT;
}
export interface ActionCompletedOnboarding {
  type: Actions.COMPLETED_ONBOARDING;
}

export interface ActionConfirmSeedPhrase {
  type: Actions.CONFIRM_SEED_PHRASE;
  privateKey: string;
  seedPhrase: string;
  pin: string;
}

export interface ActionCreatedAccount {
  type: Actions.CREATED_ACCOUNT;
  publicKey: string;
  publicAddress: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionSelectedLanguage
  | ActionChooseCreateNewAccount
  | ActionCreatedNewAccount
  | ActionCreateNewAccount
  | ActionSetUserName
  | ActionStorePrivateKey
  | ActionStoredPrivateKey
  | ActionConfirmSeedPhrase
  | ActionCompletedOnboarding
  | ActionChooseRestoreExistingAccount;

export function selectLanguage(language: string): ActionSelectedLanguage {
  return {
    type: Actions.SELECTED_LANGUAGE,
    language: language,
  };
}

export function chooseCreateNewAccount(): ActionChooseCreateNewAccount {
  return {
    type: Actions.CHOOSE_CREATE_NEW_ACCOUNT,
  };
}

export function setUserName(userName: string): ActionSetUserName {
  return {
    type: Actions.SET_USER_NAME,
    userName: userName,
  };
}

export function chooseRestoreExistingAccount(): ActionChooseRestoreExistingAccount {
  return {
    type: Actions.CHOOSE_RESTORE_EXISTING_ACCOUNT,
  };
}

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
export function createdNewAccountAction(
  address: string,
  publicKey: string,
): ActionCreatedNewAccount {
  return {
    type: Actions.CREATED_NEW_ACCOUNT,
    publicAddress: address,
    publicKey: publicKey,
  };
}
