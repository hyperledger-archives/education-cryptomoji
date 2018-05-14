'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const {
  getCollectionAddress,
  getOfferAddress
} = require('./services/addressing');
const { decode } = require('./services/encoding');
const Txn = require('./services/mock_txn');
const Context = require('./services/mock_context');

describe('Create Offer', function() {
  let handler = null;
  let context = null;
  let privateKey = null;
  let publicKey = null;
  let address = null;
  let moji = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    const createTxn = new Txn({ action: 'CREATE_COLLECTION' });
    context = new Context();
    privateKey = createTxn._privateKey;
    publicKey = createTxn._publicKey;
    return handler.apply(createTxn, context)
      .then(() => {
        const ownerAddress = getCollectionAddress(publicKey);
        moji = decode(context._state[ownerAddress]).moji.sort();
        address = getOfferAddress(publicKey, moji);
      });
  });

  it('should create an Offer for multiple moji', function() {
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address], 'Offer should exist').to.exist;
        const offer = decode(context._state[address]);

        expect(offer.owner, "Offer should include owner's public key")
          .to.equal(publicKey);
        expect(offer.moji, 'Offer should include the moji offered')
          .to.deep.equal(moji);
        expect(offer.responses, 'Offer should include an empty responses array')
          .to.deep.equal([]);
      });
  });

  it('should create an Offer for a single moji', function() {
    moji = moji.slice(0, 1);
    const address = getOfferAddress(publicKey, moji);
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address], 'Offer should exist').to.exist;
        const offer = decode(context._state[address]);

        expect(offer.moji, 'Offer should include the moji offered')
          .to.deep.equal(moji);
      });
  });

  it('should sort the moji in the response', function() {
    moji = moji.reverse();
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const offerMoji = decode(context._state[address]).moji;
        expect(offerMoji, 'Response should sort the offered moji')
          .to.have.ordered.members(moji.sort());
      });
  });

  it('should reject public keys with no Collection', function() {
    delete context._state[getCollectionAddress(publicKey)];
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Offer should not exist').to.not.exist;
      });
  });

  it('should reject an Offer without any moji', function() {
    const address = getOfferAddress(publicKey, []);
    const txn = new Txn({ action: 'CREATE_OFFER', moji: [] }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Offer should not exist').to.not.exist;
      });
  });

  it('should reject an Offer with a moji that does not exist', function() {
    delete context._state[moji[1]];
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Offer should not exist').to.not.exist;
      });
  });

  it('should reject an Offer that includes a Sire', function() {
    const sire = moji[1];
    const sireTxn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);
    const offerTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(sireTxn, context)
      .then(() => handler.apply(offerTxn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Offer should not exist').to.not.exist;
      });
  });

  it('should reject an Offer for moji already in Offer', function() {
    const firstTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    moji = moji.reverse();
    const secondTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(firstTxn, context)
      .then(() => handler.apply(secondTxn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
      });
  });

  it('should reject public keys that do not own the moji', function() {
    const createTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const privateKey = createTxn._privateKey;
    const address = getOfferAddress(createTxn._publicKey, moji);
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(createTxn, context)
      .then(() => handler.apply(txn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[address], 'Offer should not exist').to.not.exist;
      });
  });
});
