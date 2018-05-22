import * as addressing from '../source/services/addressing.js';
import { createKeys } from '../source/services/signing.js';
import { createHash, randomBytes } from 'crypto';


const hash = str => createHash('sha512').update(str).digest('hex');

describe('Addressing module', function() {

  describe('getCollectionAddress', function() {
    let publicKey = null;

    beforeEach(function() {
      publicKey = createKeys().publicKey;
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

    it('should return the type prefix if not passed a key', function() {
      const address = addressing.getCollectionAddress();
      expect(address).to.equal('5f4d76' + '00');
    });

  });

  describe('getMojiAddress', function() {
    let publicKey = null;
    let dna = null;

    beforeEach(function() {
      publicKey = createKeys().publicKey;
      dna = randomBytes(18).toString('hex');
    });

    it('should return a hexadecimal string', function() {
      const address = addressing.getMojiAddress(publicKey, dna);
      expect(address).to.be.a.hexString;
    });

    it('should return a correct cryptomoji address', function() {
      const address = addressing.getMojiAddress(publicKey, dna);
      const keyHash = hash(publicKey).slice(0, 8);
      const dnaHash = hash(dna).slice(0, 54);
      expect(address).to.equal('5f4d76' + '01' + keyHash + dnaHash);
    });

    it('should return the collection prefix if not passed dna', function() {
      const address = addressing.getMojiAddress(publicKey);
      const keyHash = hash(publicKey).slice(0, 8);
      expect(address).to.equal('5f4d76' + '01' + keyHash);
    });

    it('should return the type prefix with no parameters', function() {
      const address = addressing.getMojiAddress();
      expect(address).to.equal('5f4d76' + '01');
    });

  });

  describe('getSireAddress', function() {
    let publicKey = null;

    beforeEach(function() {
      publicKey = createKeys().publicKey;
    });

    it('should return a hexadecimal string', function() {
      const address = addressing.getSireAddress(publicKey);
      expect(address).to.be.a.hexString;
    });

    it('should return a correct sire listing address', function() {
      const address = addressing.getSireAddress(publicKey);
      const keyHash = hash(publicKey).slice(0, 62);
      expect(address).to.equal('5f4d76' + '02' + keyHash);
    });

    it('should return the type prefix if not passed a key', function() {
      const address = addressing.getSireAddress();
      expect(address).to.equal('5f4d76' + '02');
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
      publicKey = createKeys().publicKey;
      keyHash = hash(publicKey).slice(0, 8);
      dna = randomBytes(18).toString('hex');
      mojiAddress = addressing.getMojiAddress(publicKey, dna);
    });

    it('should return a hexadecimal string', function() {
      const address = addressing.getOfferAddress(publicKey, dna);
      expect(address).to.be.a.hexString;
    });

    it('should return a correct offer address', function() {
      const address = addressing.getOfferAddress(publicKey, mojiAddress);
      const addressHash = hash(mojiAddress).slice(0, 54);
      expect(address).to.equal('5f4d76' + '03' + keyHash + addressHash);
    });

    it('should return a correct offer address with multiple moji', function() {
      const mojiAddresses = [
        mojiAddress,
        addressing.getMojiAddress(publicKey, randomBytes(18).toString('hex'))
      ];

      const address = addressing.getOfferAddress(publicKey, mojiAddresses);
      const addressHash = hash(mojiAddresses.sort().join('')).slice(0, 54);

      expect(address).to.equal('5f4d76' + '03' + keyHash + addressHash);
    });

    it('should sort moji when generating an offer address', function() {
      const mojiAddresses = [
        mojiAddress,
        addressing.getMojiAddress(publicKey, randomBytes(18).toString('hex'))
      ];
      mojiAddresses.sort().reverse();

      const address = addressing.getOfferAddress(publicKey, mojiAddresses);
      const addressHash = hash(mojiAddresses.sort().join('')).slice(0, 54);

      expect(address).to.equal('5f4d76' + '03' + keyHash + addressHash);
    });

    it('should return the collection prefix if not passed moji', function() {
      const address = addressing.getOfferAddress(publicKey);
      expect(address).to.equal('5f4d76' + '03' + keyHash);
    });

    it('should return the type prefix with no parameters', function() {
      const address = addressing.getOfferAddress();
      expect(address).to.equal('5f4d76' + '03');
    });

  });

});
