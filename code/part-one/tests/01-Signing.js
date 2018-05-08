'use strict';

const { expect } = require('chai');
const secp256k1 = require('secp256k1');
const { randomBytes, createHash } = require('crypto');
const signing = require('../signing.js');


// Returns a Buffer SHA-256 hash of a string or Buffer
const sha256 = msg => createHash('sha256').update(msg).digest();

// Converts a hex string to a Buffer
const toBytes = hex => Buffer.from(hex, 'hex');

describe('Signing module', function() {

  describe('createPrivateKey', function() {
    let privateKey = null;

    beforeEach(function() {
      privateKey = signing.createPrivateKey();
    });

    it('should return a hex string', function() {
      expect(privateKey).to.be.a.hexString;
    });

    it('should generate a valid Secp256k1 private key', function() {
      const isValid = secp256k1.privateKeyVerify(toBytes(privateKey));
      expect(isValid).to.be.true;
    });
  });

  describe('sign', function() {
    const message = randomBytes(16);
    let publicKey = null;
    let signature = null;

    beforeEach(function() {
      const privateKey = signing.createPrivateKey();
      publicKey = signing.getPublicKey(privateKey);
      signature = signing.sign(privateKey, message);
    });

    it('should return a hex string', function() {
      expect(signature).to.be.a.hexString;
    });

    it('should create a valid signature', function() {
      const isValid = secp256k1.verify(
        sha256(message),
        toBytes(signature),
        toBytes(publicKey)
      );

      expect(isValid).to.be.true;
    });
  });

  describe('verify', function() {

  });
});
