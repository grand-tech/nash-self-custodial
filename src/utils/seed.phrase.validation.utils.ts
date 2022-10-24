import {ChipsInputChipProps} from 'react-native-ui-lib';

/**
 * Validate keyed in seed phrase.
 * @param inputSeedPhrase the committed seed phrase.
 * @param newChips the new seed phrase to be validated.
 */
export function validateSeedPhraseInput(
  inputSeedPhrase: ChipsInputChipProps[],
  newChips: ChipsInputChipProps[],
) {
  let validatedChips: ChipsInputChipProps[] = [];

  if (inputSeedPhrase.length === 0) {
    // how to validate the first word before commit.
    for (let index = 0; index < newChips.length; index++) {
      const chip = newChips[index];
      const label = chip.label?.trim();

      if (label) {
        if (label?.includes(' ')) {
          // if first word contains a lot of spaces potentially the whole seed phrase.
          const newLabels = label.split(' ', 24);
          const chips: ChipsInputChipProps[] = [];
          for (let i = 0; i < newLabels.length; i++) {
            const c: ChipsInputChipProps = {
              label: newLabels[i],
            };
            chips.push(c);
          }
          validatedChips = chips;
        } else {
          // if the first word has no space.
          validatedChips = newChips;
        }
      }
    }
  } else {
    // Validate an commit changes beyond the first commit
    const chips: ChipsInputChipProps[] = [];
    for (let index = 0; index < newChips.length; index++) {
      const chip = newChips[index];
      const label = chip.label?.trim();
      if (label) {
        if (!label?.includes(' ')) {
          const c: ChipsInputChipProps = {
            label: label,
          };
          chips.push(c);
        }
      }
    }
    validatedChips = chips;
  }
  return validatedChips;
}

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
