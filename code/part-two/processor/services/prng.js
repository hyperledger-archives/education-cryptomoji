'use strict';

/**
 * A function that takes any hex string as a seed, and returns a pseudo-random
 * number generator. This function will return a new seemingly random number
 * every time it is called, but will be identical to any other generator
 * created with the same seed.
 *
 * It is very important that all Sawtooth transactions are handled
 * deterministically. Functionality like creating new "random" moji cannot
 * actually be random, or multiple validators will not be able to agree on
 * state. This PNRG gives us an appearance of randomness without losing
 * determinism.
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
   * This PRNG takes an integer maximum and returns a pseudo-random integer
   * from 0 up to that maximum.
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
