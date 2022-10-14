import {ChipsInputChipProps} from 'react-native-ui-lib';

/**
 * Construct seed phrase from user`s input.
 * @returns constructed seed phrase from user input.
 */
export const constructSeedPhraseFromChipInputs = (
  inputSeedPhrase: ChipsInputChipProps[],
) => {
  let inputSeedPhraseStr = '';
  inputSeedPhrase.forEach((chip: ChipsInputChipProps) => {
    let label: string = chip.label ?? '';
    label = label.toLowerCase().trim();
    inputSeedPhraseStr = inputSeedPhraseStr + ' ' + label;
  });
  return inputSeedPhraseStr.trim();
};
