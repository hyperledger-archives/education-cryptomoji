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
describe.skip('Cancel Offer', function() {
  let handler = null;
  let context = null;
  let privateKey = null;
  let publicKey = null;
  let offer = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    context = new Context();
    const collecTxn = new Txn({ action: 'CREATE_COLLECTION' });
    privateKey = collecTxn._privateKey;
    publicKey = collecTxn._publicKey;
    return handler.apply(collecTxn, context)
      .then(() => {
        const address = getCollectionAddress(publicKey);
        const moji = decode(context._state[address]).moji;
        offer = getOfferAddress(publicKey, moji);
        const offerTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
        return handler.apply(offerTxn, context);
      });
  });

  it('should delete canceled offers', function() {
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[offer], 'Offer should not exist').to.not.exist;
      });
  });

  it('should reject public keys with no collection', function() {
    delete context._state[getCollectionAddress(publicKey)];
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err).to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[offer]).to.exist;
      });
  });

  it('should reject canceling offers that are not set', function() {
    const txn = new Txn({ action: 'CANCEL_OFFER' }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction);
  });

  it('should reject canceling offers that do not exist', function() {
    delete context._state[offer];
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err).to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
      });
  });

  it('should reject public keys that do not own the offer', function() {
    const collecTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const privateKey = collecTxn._privateKey;
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);
    const submission = handler.apply(collecTxn, context)
      .then(() => handler.apply(txn, context));

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[offer]).to.exist);
  });
});
