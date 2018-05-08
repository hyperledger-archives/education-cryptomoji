'use strict';

const secp256k1 = require('secp256k1');
const { randomBytes } = require('crypto');


// Returns a Buffer SHA-256 hash of a string or Buffer
const sha256 = msg => createHash('sha256').update(msg).digest();

// Converts a hex string to a Buffer
const toBytes = hex => Buffer.from(hex, 'hex');

const createPrivateKey = () => {
  let privateKey = null;
  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));

  return privateKey.toString('hex');
};

const getPublicKey = privateKey => {
  return secp256k1.publicKeyCreate(toBytes(privateKey)).toString('hex');
};

const sign = (message, privateKey) => {

};

const verify = (message, signature, publicKey) => {

};

module.exports = {
  createPrivateKey,
  getPublicKey,
  sign,
  verify
};
