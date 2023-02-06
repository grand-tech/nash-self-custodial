export type OnboardingNavigationStackParamsList = {
  Start: undefined;
  SelectGenerateOrRestoreAccount: undefined;
  TermsAndConditions: undefined;
  EnterUserName: undefined;
  CreatePin: undefined;
  ConfirmPin: {pin: string};
  SetUpRecoveryPhrase: undefined;
  SetUpSeedPhraseInstructions: undefined;
  EnterPinScreen: {target?: string; nextRoute: string};
  WriteDownRecoveryPhraseScreen: {mnemonic: string};
  ConfirmRecoveryPhraseScreen: {mnemonic: string};
  RestoreAccount: {pin: string};
  EnterFiatPaymentInformationScreen: undefined;
};
