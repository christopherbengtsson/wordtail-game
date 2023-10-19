// 1. Logarithmic Increase
// One idea is to increase the time logarithmically based on the number of letters.
// This means that initially, for the first few letters, the player gets a significant boost in time, but
// as more letters are added, the extra time per letter decreases.
// Example outputs:
// 0 letters: 3000ms
// 1 letter:  4828ms
// 2 letters: 5931ms
// 3 letters: 6747ms
// ... and so on
export function logarithmicDuration(numLetters: number) {
  const baseTime = 10000; // 3 seconds for 0 letters
  const logMultiplier = 2000; // Multiplier to control the rate of increase

  return baseTime + logMultiplier * Math.log(numLetters + 1);
}

// 2. Quadratic Increase
// The idea here is that the time increases as the square of the number of letters.
// The rate of increase will be slower initially but will get faster as the number of letters grows.
// Example outputs:
// 0 letters: 3000ms
// 1 letter:  3500ms
// 2 letters: 5000ms
// 3 letters: 7500ms
// ... and so on
export function quadraticDuration(numLetters: number) {
  const baseTime = 3000; // 3 seconds for 0 letters
  const quadraticMultiplier = 500; // Multiplier to control the rate of increase

  return baseTime + quadraticMultiplier * numLetters * numLetters;
}

// 3. Sigmoid Function
// A sigmoid function is an S-shaped curve and can be used to create a soft start and soft end,
// with a rapid increase in the middle.
// Example outputs:
// 0 letters: 3000ms
// 1 letter:  3955ms
// 2 letters: 5096ms
// 3 letters: 6381ms
// ... and so on
export function sigmoidDuration(numLetters: number) {
  function sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
  }
  const baseTime = 3000;
  const maxExtraTime = 10000; // The most extra time that can be given
  const scale = 0.5; // Controls the "stretch" of the sigmoid curve

  return baseTime + maxExtraTime * (sigmoid(scale * numLetters) - sigmoid(0));
}

// 4. Piecewise Function
// Break the function into intervals. For example, for 0-3 letters, give a certain time per letter,
// for 4-7 another time, and so on.
// Example outputs:
// 0 letters: 3000ms
// 1 letter:  4000ms
// 2 letters: 5000ms
// 3 letters: 6000ms
// 4 letters: 7500ms
// ... and so on
export function piecewiseDuration(numLetters: number) {
  const baseTime = 3000;
  if (numLetters <= 3) return baseTime + numLetters * 1000;
  if (numLetters <= 7) return baseTime + 3 * 1000 + (numLetters - 3) * 1500;
  return baseTime + 3 * 1000 + 4 * 1500 + (numLetters - 7) * 2000;
}

// 5. Random Element
// Add a random element, so players can't always predict the exact time they'll get.
// Example outputs (assuming random value = 1000ms for demonstration):
// Note: The output can vary due to the random element.
// 0 letters: 4000ms
// 1 letter:  5000ms
// 2 letters: 6000ms
// ... and so on
export function randomDuration(numLetters: number) {
  const baseTime = 3000;
  const timePerLetter = 1000;
  const randomTime = Math.random() * 2000; // Between 0 and 2 seconds

  return baseTime + numLetters * timePerLetter + randomTime;
}
