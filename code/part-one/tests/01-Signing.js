'use strict';

const { expect } = require('chai');
const secp256k1 = require('secp256k1');
const signing = require('../signing.js');


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

  });

  describe('verify', function() {

  });
});
