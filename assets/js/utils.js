// ---------------------
// Utility Functions
// ---------------------

/**
 * Shuffles the elements of an array randomly using the Fisher-Yates shuffle algorithm.
 *
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} A new array containing the randomly shuffled items from the input array.
 *
 */
export function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

/**
 * Generates a random number between the specified minimum and maximum values.
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between min and max.
 *
 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
