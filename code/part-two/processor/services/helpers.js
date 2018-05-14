'use strict';

// Takes a hex string and returns a function to generate pseudorandom,
// but deterministic, numbers. Based on this github gist by blixt:
// gist.github.com/blixt/f17b47c62508be59987b
const getPrng = hex => {
  let seed = parseInt(hex, 16);
  if (!seed) {
    seed = 1111111111;
  }

  // Returns a pseudorandom integer from 0 to max
  return max => {
    seed = seed * 16807 % 2147483647;
    return Math.floor(seed / 2147483646 * max);
  };
};

module.exports = {
  getPrng
};
