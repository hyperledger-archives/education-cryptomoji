'use strict';

const { createHash } = require('crypto');


// Returns the first characters of a SHA-512 hash of a string
const hash = (str) => {
  return createHash('sha512').update(str).digest('hex');
};

module.exports = {
  hash
};
