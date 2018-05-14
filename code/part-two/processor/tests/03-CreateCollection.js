'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const {
  getCollectionAddress,
  getMojiAddress
} = require('./services/addressing');
const { decode } = require('./services/encoding');
const Txn = require('./services/mock_txn');
const Context = require('./services/mock_context');


describe('Create Collection', function() {
  let handler = null;
  let context = null;
  let txn = null;
  let publicKey = null;
  let address = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    context = new Context();
    txn = new Txn({ action: 'CREATE_COLLECTION' });
    publicKey = txn._publicKey;
    address = getCollectionAddress(publicKey);
  });

  it('should create a Collection at the correct address', function() {
    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address], 'Collection should exist').to.exist;
        const collection = decode(context._state[address]);

        expect(collection.key, 'Collection should have a public key')
          .to.equal(publicKey);
        expect(collection.moji, 'Collection should have a moji array')
          .to.be.an('array');
      });
  });

  it('should create three moji for each new collection', function() {
    return handler.apply(txn, context)
      .then(() => {
        const collection = decode(context._state[address]);
        const mojiAddress = collection.moji[0];

        expect(collection.moji, 'Collection should have three moji addresses')
          .to.have.lengthOf(3);
        expect(mojiAddress, 'Moji address should be 70 hex characters')
          .to.be.a.hexString.with.lengthOf(70);
        expect(context._state[mojiAddress], 'Moji should exist').to.exist;
        const moji = decode(context._state[mojiAddress]);

        expect(moji.dna, 'Moji DNA should be 36 hex characters')
          .to.be.a.hexString.with.lengthOf(36);
        expect(mojiAddress, 'Moji address match address generated from DNA')
          .to.equal(getMojiAddress(publicKey, moji.dna));
      });
  });

  it('should create moji deterministically', function() {
    let oldMoji = null;

    return handler.apply(txn, context)
      .then(() => {
        const collection = decode(context._state[address]);
        oldMoji = collection.moji;

        // Delete the created collection and cryptomoji
        oldMoji.concat(address).forEach(addr => delete context._state[addr] );

        return handler.apply(txn, context);
      })
      .then(() => {
        const collection = decode(context._state[address]);

        expect(collection.moji, 'New moji should match old moji')
          .to.deep.equal(oldMoji);
      });
  });

  it('should create moji pseudorandomly', function() {
    let oldMoji = null;

    return handler.apply(txn, context)
      .then(() => {
        const collection = decode(context._state[address]);
        oldMoji = collection.moji;

        // Delete the created collection and cryptomoji
        oldMoji.concat(address).forEach(addr => delete context._state[addr] );

        // Modify a character in the signature to change the prng seed
        const firstSig = txn.signature[0] !== 'f'
          ? (parseInt(txn.signature[0], 16) + 1).toString(16)
          : '0';
        txn.signature = firstSig + txn.signature.slice(1);

        return handler.apply(txn, context);
      })
      .then(() => {
        const collection = decode(context._state[address]);

        expect(collection.moji, 'Moji should not match when signature changes')
          .to.not.deep.equal(oldMoji);
      });
  });

  it('should reject a public key that has already been used', function() {
    return handler.apply(txn, context)
      .then(() => handler.apply(txn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
      });
  });
});
