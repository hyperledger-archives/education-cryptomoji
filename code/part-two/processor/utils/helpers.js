'use strict';

const { createHash } = require('crypto');


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

module.exports = {
  hash,
  encode,
  decode
};
