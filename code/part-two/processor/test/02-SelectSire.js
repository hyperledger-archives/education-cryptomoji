'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const {
  getCollectionAddress,
  getSireAddress
} = require('./services/addressing');
const { decode } = require('../services/helpers');
const Txn = require('./services/mock_txn');
const Context = require('./services/mock_context');

describe('Select Sire', function() {
  let handler = null;
  let context = null;
  let privateKey = null;
  let publicKey = null;
  let address = null;
  let sire = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    const createTxn = new Txn({ action: 'CREATE_COLLECTION' });
    context = new Context();
    privateKey = createTxn._privateKey;
    publicKey = createTxn._publicKey;
    address = getSireAddress(publicKey);
    return handler.apply(createTxn, context)
      .then(() => {
        const address = getCollectionAddress(publicKey);
        sire = decode(context._state[address]).moji[0];
      });
  });

  it('should list a Sire at the correct address', function() {
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address], 'Sire listing should exist').to.exist;
        const listing = decode(context._state[address]);

        expect(listing.owner, "Sire listing should include owner's public key")
          .to.equal(publicKey);
        expect(listing.sire, "Sire listing should include the sire's address")
          .to.equal(sire);
      });
  });

  it('should reject public keys with no Collection', function() {
    delete context._state[getCollectionAddress(publicKey)];
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Sire listing should not exist')
          .to.not.exist;
      });
  });

  it('should reject listings with no sire', function() {
    const txn = new Txn({ action: 'SELECT_SIRE' }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
      });
  });

  it('should reject sires that do not exist', function() {
    delete context._state[sire];
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Sire listing should not exist')
          .to.not.exist;
      });
  });

  it('should reject public keys that do not own the Sire', function() {
    const createTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const address = getSireAddress(createTxn._publicKey);
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, createTxn._privateKey);

    return handler.apply(createTxn, context)
      .then(() => handler.apply(txn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Sire listing should not exist')
          .to.not.exist;
      });
  });
});
