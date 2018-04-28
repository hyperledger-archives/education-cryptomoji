import * as secp256k1 from 'secp256k1';
import * as signing from '../source/services/signing.js';


describe('Signing module', function() {

  describe('createKeys', function() {
    let keys = null;

    beforeEach(function() {
      keys = signing.createKeys();
    });

    it('should return an object with two keys', function() {
      expect(keys).to.have.property('privateKey');
      expect(keys).to.have.property('publicKey');
    });

    it('should have keys that are hexadecimal strings', function() {
      const { privateKey, publicKey } = keys;

      expect(privateKey).to.be.a.hexString;
      expect(publicKey).to.be.a.hexString;
    });

    it('should generate valid Secp256k1 keys', function() {
      const privateKeyBytes = Buffer.from(keys.privateKey, 'hex');
      const publicKeyBytes = Buffer.from(keys.publicKey, 'hex');

      expect(secp256k1.privateKeyVerify(privateKeyBytes)).to.be.true;
      expect(secp256k1.publicKeyVerify(publicKeyBytes)).to.be.true;
    });

    it('should have a public key derived from its private key', function() {
      const privateKeyBytes = Buffer.from(keys.privateKey, 'hex');
      const generatedPublicKey = secp256k1
        .publicKeyCreate(privateKeyBytes)
        .toString('hex');

      expect(keys.publicKey).to.equal(generatedPublicKey);
    });

  });

});
