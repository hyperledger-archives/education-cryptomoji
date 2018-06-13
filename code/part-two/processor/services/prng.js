'use strict';

/**
 * A function that takes any hex string as a seed, and returns a pseudo-random
 * number generator. This generator function will return a (seemingly) random
 * number every time it is called. However, the exact same sequence of
 * (seemingly) random numbers can be reproduced from a different generator
 * function created with the same seed.
 *
 * This deliberately pseudo-random approach is very important when building a
 * Sawtooth transaction processor, where all transactions *must* be handled
 * deterministically. Functionality like creating new "random" moji cannot
 * actually be random, or different validators will not be able to agree on
 * blockchain state. This PNRG gives us an appearance of randomness without
 * losing determinism.
 *
 * Based on this github gist by @blixit:
 * gist.github.com/blixt/f17b47c62508be59987b
 */
const getPrng = hex => {
  let seed = parseInt(hex, 16);
  if (!seed) {
    seed = 1111111111;
  }

  /**
   * This PRNG function takes an integer maximum and returns a pseudo-random
   * integer from 0 up to that maximum.
   *
   * Example:
   *   const prng = getPrng('5eed');
   *   prng(100);  // 19
   *   prng(100);  // 49
   *   prng(100);  // 96
   */
  return max => {
    seed = seed * 16807 % 2147483647;
    return Math.floor(seed / 2147483646 * max);
  };
};

module.exports = getPrng;
