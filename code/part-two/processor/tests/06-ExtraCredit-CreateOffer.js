'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('./services/handler_wrapper');
const {
  getCollectionAddress,
  getOfferAddress
} = require('./services/addressing');
const { decode } = require('./services/encoding');
const Txn = require('./services/mock_txn');
const Context = require('./services/mock_context');


// EXTRA CREDIT: Remove `.skip` to test
describe.skip('Create Offer', function() {
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

  it('should create offers with multiple moji', function() {
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address]).to.exist;

        const offer = decode(context._state[address]);
        expect(offer.owner).to.equal(publicKey);
        expect(offer.moji).to.deep.equal(moji);
        expect(offer.responses).to.deep.equal([]);
      });
  });

  it('should create offers with a single moji', function() {
    moji = moji.slice(0, 1);
    const address = getOfferAddress(publicKey, moji);
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address]).to.exist;

        const offer = decode(context._state[address]);
        expect(offer.moji).to.deep.equal(moji);
      });
  });

  it('should sort moji in any new offer', function() {
    moji = moji.reverse();
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const offerMoji = decode(context._state[address]).moji;
        expect(offerMoji, 'New offers should sort their moji')
          .to.have.ordered.members(moji.sort());
      });
  });

  it('should reject public keys with no collection', function() {
    delete context._state[getCollectionAddress(publicKey)];
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });

  it('should reject offers without any moji', function() {
    const address = getOfferAddress(publicKey, []);
    const txn = new Txn({ action: 'CREATE_OFFER', moji: [] }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });

  it('should reject offers with any moji that do not exist', function() {
    delete context._state[moji[1]];
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });

  it('should reject offers that include a sire', function() {
    const sire = moji[1];
    const sireTxn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);
    const offerTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    const submission = handler.apply(sireTxn, context)
      .then(() => handler.apply(offerTxn, context));

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });

  it('should reject offers for moji already in an offer', function() {
    const firstTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    moji = moji.reverse();
    const secondTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    const submission = handler.apply(firstTxn, context)
      .then(() => handler.apply(secondTxn, context));

    return expect(submission).to.be.rejectedWith(InvalidTransaction);
  });

  it('should reject public keys that do not own the moji', function() {
    const createTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const privateKey = createTxn._privateKey;
    const address = getOfferAddress(createTxn._publicKey, moji);
    const txn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
    const submission = handler.apply(createTxn, context)
      .then(() => handler.apply(txn, context));

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });
});
