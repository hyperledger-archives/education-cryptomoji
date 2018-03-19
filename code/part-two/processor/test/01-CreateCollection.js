'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const { NAMESPACE } = require('../utils/constants');
const { hash, decode } = require('../utils/helpers');
const Txn = require('./mocks/txn');
const Context = require('./mocks/context');

const getCollectionAddress = publicKey => {
  return NAMESPACE + '01' + hash(publicKey, 62);
};

describe('Create Collection', function() {
  let handler = null;
  let context = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    context = new Context();
  });

  it('should create a Collection at the correct address', function() {
    const txn = new Txn({ action: 'CREATE_COLLECTION' });
    const publicKey = txn.header.signerPublicKey;
    const address = getCollectionAddress(publicKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context.state[address], 'Collection should exist').to.exist;
        const collection = decode(context.state[address]);

        expect(collection.key, 'Collection should have a public key')
          .to.equal(publicKey);
        expect(collection.moji, 'Collection should have a moji array')
          .to.deep.equal([]);
      });
  });

  it('should reject a public key that has already been used', function() {
    const txn = new Txn({ action: 'CREATE_COLLECTION' });

    return handler.apply(txn, context)
      .then(() => handler.apply(txn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        expect(err.message, 'Error message should include a public key')
          .to.include(txn.header.signerPublicKey);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
      });
  });
});
