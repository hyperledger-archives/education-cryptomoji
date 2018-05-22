'use strict';

const { expect } = require('chai');
const { createHash, randomBytes } = require('crypto');

const getPrng = require('../services/prng');
const encoding = require('../services/encoding');
const addressing = require('../services/addressing');


// Returns a hex-string SHA-512 hash sliced to a particular length
const hash = (str, length) => {
  return createHash('sha512').update(str).digest('hex').slice(0, length);
};

describe('Processor services', function() {

  describe('prng', function() {

  });

  describe('encoding', function() {

    describe('encode', function() {
      const toEncode = { hello: 'world', foo: 'bar' };
      let encoded = null;

      beforeEach(function() {
        encoded = encoding.encode(toEncode);
      });

      it('should return a Buffer', function() {
        expect(encoded).to.be.an.instanceOf(Buffer);
      });

      it('should return a Buffer, parseable as a JSON string', function() {
        const stringified = encoded.toString();
        expect(() => JSON.parse(stringified)).to.not.throw();
      });

      it('should return a sorted JSON string', function() {
        const stringified = encoded.toString();
        const helloIndex = stringified.indexOf('hello');
        const fooIndex = stringified.indexOf('foo');

        expect(helloIndex).to.not.equal(-1);
        expect(fooIndex).to.not.equal(-1);
        expect(fooIndex).to.be.lessThan(helloIndex);
      });

      it('should be parseable to the original object', function() {
        const decoded = JSON.parse(encoded.toString());
        expect(decoded).to.deep.equal(toEncode);
      });

    });

    describe('decode', function() {
      const toEncode = { hello: 'world', foo: 'bar' };
      let decoded = null;

      beforeEach(function() {
        const encoded = encoding.encode(toEncode);
        decoded = encoding.decode(encoded);
      });

      it('should take an encoded Buffer and return an object', function() {
        expect(decoded).to.be.an('object');
      });

      it('should return an object that matches the encoded object', function() {
        expect(decoded).to.deep.equal(toEncode);
      });
    });
  });

  describe('addressing', function() {

    describe('getCollectionAddress', function() {
      let publicKey = null;

      beforeEach(function() {
        publicKey = '03' + randomBytes(32).toString('hex');
      });

      it('should return a hexadecimal string', function() {
        const address = addressing.getCollectionAddress(publicKey);
        expect(address).to.be.a.hexString;
      });

      it('should return a correct collection address', function() {
        const address = addressing.getCollectionAddress(publicKey);
        const keyHash = hash(publicKey).slice(0, 62);
        expect(address).to.equal('5f4d76' + '00' + keyHash);
      });
    });

    describe('getMojiAddress', function() {
      let publicKey = null;
      let dna = null;

      beforeEach(function() {
        publicKey = '03' + randomBytes(32).toString('hex');
        dna = randomBytes(18).toString('hex');
      });

      it('should return a hexadecimal string', function() {
        const address = addressing.getMojiAddress(publicKey, dna);
        expect(address).to.be.a.hexString;
      });

      it('should return a correct Cryptomoji address', function() {
        const address = addressing.getMojiAddress(publicKey, dna);
        const keyHash = hash(publicKey).slice(0, 8);
        const dnaHash = hash(dna).slice(0, 54);
        expect(address).to.equal('5f4d76' + '01' + keyHash + dnaHash);
      });
    });

    describe('getSireAddress', function() {
      let publicKey = null;

      beforeEach(function() {
        publicKey = '03' + randomBytes(32).toString('hex');
      });

      it('should return a hexadecimal string', function() {
        const address = addressing.getSireAddress(publicKey);
        expect(address).to.be.a.hexString;
      });

      it('should return a correct Sire listing address', function() {
        const address = addressing.getSireAddress(publicKey);
        const keyHash = hash(publicKey).slice(0, 62);
        expect(address).to.equal('5f4d76' + '02' + keyHash);
      });
    });

    // Offers are a part of the extra credit portion of the sprint.
    // Remove the `.skip` to run these tests.
    describe.skip('getOfferAddress', function() {
      let publicKey = null;
      let keyHash = null;
      let dna = null;
      let mojiAddress = null;

      beforeEach(function() {
        publicKey = '03' + randomBytes(32).toString('hex');
        keyHash = hash(publicKey).slice(0, 8);
        dna = randomBytes(18).toString('hex');
        mojiAddress = addressing.getMojiAddress(publicKey, dna);
      });

      it('should return a hexadecimal string', function() {
        const address = addressing.getOfferAddress(publicKey, dna);
        expect(address).to.be.a.hexString;
      });

      it('should return a correct Offer address', function() {
        const address = addressing.getOfferAddress(publicKey, mojiAddress);
        const addressHash = hash(mojiAddress).slice(0, 54);
        expect(address).to.equal('5f4d76' + '03' + keyHash + addressHash);
      });

      it('should return a Offer address with multiple moji', function() {
        const mojiAddresses = [
          mojiAddress,
          addressing.getMojiAddress(publicKey, randomBytes(18).toString('hex'))
        ];

        const address = addressing.getOfferAddress(publicKey, mojiAddresses);
        const addressHash = hash(mojiAddress + mojiAddresses[1]).slice(0, 54);

        expect(address).to.equal('5f4d76' + '03' + keyHash + addressHash);
      });
    });

    describe('isValidAddress', function() {

    });
  });

});
