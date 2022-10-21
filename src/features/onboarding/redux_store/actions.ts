export enum Actions {
  SELECTED_LANGUAGE = 'ONBOARDING/SELECTED_LANGUAGE',

  CHOOSE_RESTORE_EXISTING_ACCOUNT = 'ONBOARDING/CHOOSE_RESTORE_EXISTING_ACCOUNT',
  CHOOSE_CREATE_NEW_ACCOUNT = 'ONBOARDING/CHOOSE_CREATE_NEW_ACCOUNT',
  CREATE_NEW_ACCOUNT = 'ONBOARDING/CREATE_NEW_ACCOUNT',
  CREATED_NEW_ACCOUNT = 'ONBOARDING/CREATED_NEW_ACCOUNT',

  SET_USER_NAME = 'ONBOARDING/SET_USER_NAME',
  COMPLETED_ONBOARDING = 'ONBOARDING/COMPLETED_ONBOARDING',

  CONFIRM_SEED_PHRASE = 'ONBOARDING/CONFIRM_SEED_PHRASE',

  ADOPT_NEW_ACCOUNT = 'ONBOARDING/ADOPT_NEW_ACCOUNT',
  ADOPTED_NEW_ACCOUNT = 'ONBOARDING/ADOPTED_NEW_ACCOUNT',
}

export interface ActionSelectedLanguage {
  type: Actions.SELECTED_LANGUAGE;
  language: string;
}

export interface ActionChooseRestoreExistingAccount {
  type: Actions.CHOOSE_RESTORE_EXISTING_ACCOUNT;
}

export interface ActionChooseCreateNewAccount {
  type: Actions.CHOOSE_CREATE_NEW_ACCOUNT;
}

export interface ActionCreateNewAccount {
  type: Actions.CREATE_NEW_ACCOUNT;
  pin: string;
}

export interface ActionCreatedNewAccount {
  type: Actions.CREATED_NEW_ACCOUNT;
  publicAddress: string;
  publicKey: string;
}

export interface ActionSetUserName {
  type: Actions.SET_USER_NAME;
  userName: string;
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

export interface ActionAdoptNewAccount {
  type: Actions.ADOPT_NEW_ACCOUNT;
  pin: string;
}

export interface ActionAdoptedNewAccount {
  type: Actions.ADOPTED_NEW_ACCOUNT;
  publicKey: string;
  publicAddress: string;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | ActionSelectedLanguage
  | ActionChooseCreateNewAccount
  | ActionConfirmSeedPhrase
  | ActionCompletedOnboarding
  | ActionChooseRestoreExistingAccount
  | ActionAdoptNewAccount
  | ActionAdoptedNewAccount
  | ActionSetUserName
  | ActionCreateNewAccount;
