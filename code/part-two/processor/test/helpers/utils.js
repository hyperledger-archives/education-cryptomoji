'use strict';

const { createHash } = require('crypto');

const hash = (str, length = 128) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';
const NAMESPACE = hash(FAMILY_NAME, 6);

const encode = obj => {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  return Buffer.from(jsonString);
};

const decode = encoded => JSON.parse(encoded.toString());

module.exports = {
  FAMILY_NAME,
  FAMILY_VERSION,
  NAMESPACE,
  hash,
  encode,
  decode
};
