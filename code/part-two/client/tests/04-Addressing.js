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

    it('should return a correct Cryptomoji address', function() {
      const address = addressing.getMojiAddress(publicKey, dna);
      const keyHash = hash(publicKey).slice(0, 8);
      const dnaHash = hash(dna).slice(0, 54);
      expect(address).to.equal('5f4d76' + '01' + keyHash + dnaHash);
    });

    it('should return the Collection prefix if not passed dna', function() {
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

    it('should return a correct Sire listing address', function() {
      const address = addressing.getSireAddress(publicKey);
      const keyHash = hash(publicKey).slice(0, 62);
      expect(address).to.equal('5f4d76' + '02' + keyHash);
    });

    it('should return the type prefix if not passed a key', function() {
      const address = addressing.getSireAddress();
      expect(address).to.equal('5f4d76' + '02');
    });

  });

});
