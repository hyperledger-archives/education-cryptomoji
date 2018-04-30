import * as addressing from '../source/services/addressing.js';
import { createKeys } from '../source/services/signing.js';
import { createHash } from 'crypto';


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

});
