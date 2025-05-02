/**
 * The function returns a random number between min and max. Both are included
 * and it is assumed that both parameters are integers.
 */
const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * The function shuffles an array in place.
 */
export const shuffleArr = (arr: Array<object>) => {
  for (let i = 0; i < arr.length; i++) {
    //
    // Get a random index of the array
    //
    const j = getRandomIntInclusive(0, arr.length - 1);

    //
    // Ensure that there is something to do
    //
    if (i === j) {
      continue;
    }

    //
    // Swap i and j
    //
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
