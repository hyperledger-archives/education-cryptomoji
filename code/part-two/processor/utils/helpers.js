'use strict';

const { createHash } = require('crypto');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');


// Returns the first characters of a SHA-512 hash of a string
const hash = (str, length = 128) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

// Encodes an object as a Buffer of sorted JSON string
// Only works with objects with a depth of 1
const encode = obj => {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  return Buffer.from(jsonString);
};

// Decodes JSON Buffers back into objects
const decode = encoded => JSON.parse(encoded.toString());

// Returns a rejected promise with an InvalidTransaction
const reject = (...messages) => {
  return new Promise((_, reject) => {
    reject(new InvalidTransaction(messages.join(' ')));
  });
};

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
  hash,
  encode,
  decode,
  reject,
  getPrng
};
