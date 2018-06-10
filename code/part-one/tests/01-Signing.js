'use strict';

const { expect } = require('chai');
const secp256k1 = require('secp256k1');
const { randomBytes, createHash } = require('crypto');
const signing = require('../signing.js');


// Returns a Buffer SHA-256 hash of a string or Buffer
const sha256 = msg => createHash('sha256').update(msg).digest();

// Converts a hex string to a Buffer
const toBytes = hex => Buffer.from(hex, 'hex');

// Generate a random alphanumeric string with a random length
const randomString = () => {
  return randomBytes(Math.floor(Math.random() * 256))
    .toString('base64')
    .replace(/[\/\+=]/g, '');
};

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

  describe('getPublicKey', function() {
    let privateKey = null;
    let publicKey = null;

    beforeEach(function() {
      privateKey = signing.createPrivateKey();
      publicKey = signing.getPublicKey(privateKey);
    });

    it('should return a hex string', function() {
      expect(publicKey).to.be.a.hexString;
    });

    it('should generate a valid Secp256k1 public key', function() {
      const isValid = secp256k1.privateKeyVerify(toBytes(privateKey));
      expect(isValid).to.be.true;
    });

    it('should have a public key derived from its private key', function() {
      const generatedPublicKey = secp256k1
        .publicKeyCreate(toBytes(privateKey))
        .toString('hex');

      expect(publicKey).to.equal(generatedPublicKey);
    });
  });

  describe('sign', function() {
    const message = randomString();
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
    const message = randomString();
    let publicKey = null;
    let signature = null;

    beforeEach(function() {
      const privateKey = signing.createPrivateKey();
      publicKey = signing.getPublicKey(privateKey);
      signature = secp256k1
        .sign(sha256(message), toBytes(privateKey))
        .signature
        .toString('hex');
    });

    it('should verify a correct signature', function() {
      const isValid = signing.verify(publicKey, message, signature);

      expect(isValid).to.be.true;
    });

    it('should reject a signature with a mismatched public key', function() {
      const publicKey = signing.getPublicKey(signing.createPrivateKey());
      const isValid = signing.verify(publicKey, message, signature);

      expect(isValid).to.be.false;
    });

    it('should reject a signature with a mismatched message', function() {
      const message = randomString();
      const isValid = signing.verify(publicKey, message, signature);

      expect(isValid).to.be.false;
    });
  });
});
