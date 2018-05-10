'use strict';

const secp256k1 = require('secp256k1');
const { randomBytes, createHash } = require('crypto');


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

const sign = (privateKey, message) => {
  const { signature } = secp256k1.sign(sha256(message), toBytes(privateKey));
  return signature.toString('hex');
};

const verify = (publicKey, message, signature) => {
  return secp256k1.verify(
    sha256(message),
    toBytes(signature),
    toBytes(publicKey)
  );
};

module.exports = {
  createPrivateKey,
  getPublicKey,
  sign,
  verify
};
