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
        .and.equal('0.1');

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

  describe('createBatch', function() {
    let keys = null;
    let transaction = null;
    let batch = null;

    beforeEach(function() {
      keys = createKeys();
      const payload = { hello: 'world' };
      transaction = transactions.createTransaction(keys.privateKey, payload);
      batch = transactions.createBatch(keys.privateKey, transaction);
    });

    it('should return a valid Batch message', function() {
      expect(batch).to.be.instanceOf(Message);
      // Batch.verify returns an error message if it fails
      expect(Batch.verify(batch)).to.be.null;
    });

    it('should return a Batch with the correct properties', function() {
      expect(batch.header)
        .to.be.set
        .and.be.bytes;
      expect(batch.headerSignature)
        .to.be.set
        .and.be.a.hexString;
      expect(batch.transactions)
        .to.be.set
        .and.be.an('array');
    });

    it('should include a BatchHeader with the correct properties', function() {
      expect(() => BatchHeader.decode(batch.header)).to.not.throw();
      const header = BatchHeader.decode(batch.header);

      expect(header.signerPublicKey)
        .to.be.set
        .and.be.a.hexString
        .and.equal(keys.publicKey);
      expect(header.transactionIds)
        .to.be.set
        .and.be.an('array')
        .and.deep.equal([transaction.headerSignature]);
    });

    it('should include a valid signature of the header', function() {
      const publicKeyBytes = Buffer.from(keys.publicKey, 'hex');
      const signatureBytes = Buffer.from(batch.headerSignature, 'hex');
      const headerHash = createHash('sha256').update(batch.header).digest();
      const isValid = secp256k1.verify(
        headerHash,
        signatureBytes,
        publicKeyBytes
      );

      expect(isValid).to.be.true;
    });

    it('should include the passed Transaction', function() {
      expect(batch.transactions).to.deep.equal([transaction]);
    });

    it('should create a Batch with multiple transactions', function() {
      const transactionArray = [
        transaction,
        transactions.createTransaction(keys.privateKey, { foo: 'bar' })
      ];
      batch = transactions.createBatch(keys.privateKey, transactionArray);
      const header = BatchHeader.decode(batch.header);

      expect(batch.transactions)
        .to.deep.equal(transactionArray);
      expect(header.transactionIds)
        .to.deep.equal(transactionArray.map(t => t.headerSignature));
    });

  });

  describe('encodeBatches', function() {
    let batch = null;
    let encoded = null;

    beforeEach(function() {
      const keys = createKeys();
      const payload = { hello: 'world' };
      const txn = transactions.createTransaction(keys.privateKey, payload);
      batch = transactions.createBatch(keys.privateKey, txn);
      encoded = transactions.encodeBatches(batch);
    });

    it('should return a Buffer or Uint8Array', function() {
      expect(encoded).to.be.bytes;
    });

    it('should return a decodeable BatchList', function() {
      expect(() => BatchList.decode(encoded)).to.not.throw();
      const decoded = BatchList.decode(encoded);
      expect(decoded.batches[0]).to.deep.equal(batch);
    });

  });

  describe('encodeAll', function() {
    let keys = null;
    let payload = null;
    let encoded = null;

    beforeEach(function() {
      keys = createKeys();
      payload = { hello: 'world' };
      encoded = transactions.encodeAll(keys.privateKey, payload);
    });

    it('should return a Buffer or Uint8Array', function() {
      expect(encoded).to.be.bytes;
    });

    it('should be decodeable into the original payload', function() {
      expect(() => BatchList.decode(encoded)).to.not.throw();
      const decodedList = BatchList.decode(encoded);
      const encodedPayload = decodedList.batches[0].transactions[0].payload;

      expect(() => decode(encodedPayload)).to.not.throw();
      const decodedPayload = decode(encodedPayload);

      expect(decodedPayload).to.deep.equal(payload);
    });

    it('should encode multiple payloads', function() {
      const payloads = [ payload, { foo: 'bar' } ];
      const encoded = transactions.encodeAll(keys.privateKey, payloads);

      const decodedPayloads = BatchList
        .decode(encoded)
        .batches[0]
        .transactions
        .map(t => decode(t.payload));

      expect(decodedPayloads).to.deep.equal(payloads);
    });

  });

});
