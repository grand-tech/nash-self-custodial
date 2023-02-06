export interface PinUpdates {
  currentIndex: number;
  pinArray: string[];
}

/**
 * Deletes a character in the entered pin.
 * @param currentIndex the currently selected index.
 * @param pinCharArray the list of characters making up the pin.
 * @returns updates for the component.
 */
export const deletePinChar = (currentIndex: number, pinCharArray: string[]) => {
  let newPinArray = ['', '', '', '', '', ''];
  let newCurrentIndex = currentIndex - 1;

  let updates: PinUpdates = {
    currentIndex: 0,
    pinArray: ['', '', '', '', '', ''],
  };

  if (
    currentIndex === pinCharArray.length - 1 &&
    pinCharArray[currentIndex] !== ''
  ) {
    // update the new list of characters except for the last character.
    const top = pinCharArray.length - 1;
    for (let index = 0; index < top; index++) {
      newPinArray[index] = pinCharArray[index];
    }
    updates = {
      currentIndex: currentIndex,
      pinArray: newPinArray,
    };
  } else if (currentIndex > 0) {
    // Iterate over the list of characters deleting the new current index.
    for (let index = 0; index < pinCharArray.length; index++) {
      if (newCurrentIndex === index) {
        newPinArray[index] = '';
      } else {
        newPinArray[index] = pinCharArray[index];
      }
    }

    updates = {
      currentIndex: newCurrentIndex,
      pinArray: newPinArray,
    };
  }
  return updates;
};

/**
 * Deletes a character in the entered pin.
 * @param currentIndex the currently selected index.
 * @param pinCharArray the list of characters making up the pin.
 * @returns updates for the component.
 */
export const addPinChar = (
  pinChar: string,
  currentIndex: number,
  pinCharArray: string[],
) => {
  let newPinArray = ['', '', '', '', '', ''];
  let newCurrentIndex = currentIndex;

  let updates: PinUpdates = {
    currentIndex: 0,
    pinArray: ['', '', '', '', '', ''],
  };

  if (currentIndex < pinCharArray.length && pinCharArray[currentIndex] === '') {
    for (let index = 0; index < pinCharArray.length; index++) {
      if (currentIndex === index) {
        newPinArray[index] = pinChar;
      } else {
        newPinArray[index] = pinCharArray[index];
      }

      if (currentIndex < pinCharArray.length - 1) {
        // Limit the max index to the number of characters expected.
        newCurrentIndex = currentIndex + 1;
      }
    }

    updates = {
      currentIndex: newCurrentIndex,
      pinArray: newPinArray,
    };
  } else {
    updates = {
      currentIndex: currentIndex,
      pinArray: pinCharArray,
    };
  }

  return updates;
};
