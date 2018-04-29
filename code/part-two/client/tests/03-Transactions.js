import * as secp256k1 from 'secp256k1';
import { Message } from 'protobufjs';
import { createHash } from 'crypto';
import {
  Transaction,
  TransactionHeader,
  Batch,
  BatchHeader,
  BatchList
} from 'sawtooth-sdk/protobuf';

import * as transactions from '../source/services/transactions.js';
import { createKeys } from '../source/services/signing.js';
import { encode, decode } from '../source/services/encoding.js';


describe('Transactions module', function() {

  describe('createTransaction', function() {
    const payload = { hello: 'world' };
    let keys = null;
    let transaction = null;

    beforeEach(function() {
      keys = createKeys();
      transaction = transactions.createTransaction(keys.privateKey, payload);
    });

    it('should return a valid Transaction message', function() {
      expect(transaction).to.be.instanceOf(Message);
      // Transaction.verify returns an error message if it fails
      expect(Transaction.verify(transaction)).to.be.null;
    });

    it('should return a Transaction with the correct properties', function() {
      expect(transaction.header)
        .to.be.set
        .and.be.bytes;
      expect(transaction.headerSignature)
        .to.be.set
        .and.be.a.hexString;
      expect(transaction.payload)
        .to.be.set
        .and.be.bytes;
    });

    it('should include TransactionHeader with correct properties', function() {
      expect(() => TransactionHeader.decode(transaction.header)).to.not.throw();
      const header = TransactionHeader.decode(transaction.header);

      expect(header.signerPublicKey)
        .to.be.set
        .and.be.a.hexString
        .and.equal(keys.publicKey);
      expect(header.batcherPublicKey)
        .to.be.set
        .and.be.a.hexString
        .and.equal(keys.publicKey);
      expect(header.familyName)
        .to.be.set
        .and.be.a('string')
        .and.equal('cryptomoji');
      expect(header.familyVersion)
        .to.be.set
        .and.be.a('string')
        .and.equal('1.0');

      expect(header.inputs)
        .to.be.set
        .and.be.an('array');
      header.inputs.forEach(input => {
        expect(input).to.be.a.hexString.and.match(/^5f4d76/);
      });
      expect(header.outputs)
        .to.be.set
        .and.be.an('array');
      header.outputs.forEach(output => {
        expect(output).to.be.a.hexString.and.match(/^5f4d76/);
      });

      const repeatNonce = TransactionHeader.decode(
        transactions.createTransaction(keys.privateKey, payload).header
      ).nonce;
      const payloadHash = createHash('sha512')
        .update(encode(payload))
        .digest('hex');
      expect(header.nonce)
        .to.be.set
        .and.not.equal(repeatNonce);
      expect(header.payloadSha512)
        .to.be.set
        .and.be.a.hexString
        .and.equal(payloadHash);
    });

    it('should include a valid signature of the header', function() {
      const publicKeyBytes = Buffer.from(keys.publicKey, 'hex');
      const signatureBytes = Buffer.from(transaction.headerSignature, 'hex');
      const headerHash = createHash('sha256')
        .update(transaction.header)
        .digest();
      const isValid = secp256k1.verify(
        headerHash,
        signatureBytes,
        publicKeyBytes
      );

      expect(isValid).to.be.true;
    });

    it('should include a decodeable payload', function() {
      expect(() => decode(transaction.payload)).to.not.throw();
      const decoded = decode(transaction.payload);
      expect(decoded).to.deep.equal(payload);
    });

  });

});
