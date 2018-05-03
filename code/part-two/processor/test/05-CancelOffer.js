'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const getAddress = require('../utils/addressing');
const { decode } = require('../utils/helpers');
const Txn = require('./mocks/txn');
const Context = require('./mocks/context');

describe('Cancel Offer', function() {
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
        const address = getAddress.collection(publicKey);
        const moji = decode(context._state[address]).moji;
        offer = getAddress.offer(publicKey)(moji);
        const offerTxn = new Txn({ action: 'CREATE_OFFER', moji }, privateKey);
        return handler.apply(offerTxn, context);
      });
  });

  it('should delete a canceled offer', function() {
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[offer], 'Offer should not exist').to.not.exist;
      });
  });

  it('should reject public keys with no Collection', function() {
    delete context._state[getAddress.collection(publicKey)];
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[offer], 'Offer should still exist').to.exist;
      });
  });

  it('should reject canceling an offer that is not set', function() {
    const txn = new Txn({ action: 'CANCEL_OFFER' }, privateKey);

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

  it('should reject canceling an offer that does not exist', function() {
    delete context._state[offer];
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

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

  it('should reject public keys that do not own the offer', function() {
    const collecTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const privateKey = collecTxn._privateKey;
    const txn = new Txn({ action: 'CANCEL_OFFER', offer }, privateKey);

    return handler.apply(collecTxn, context)
      .then(() => handler.apply(txn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        expect(context._state[offer], 'Offer should still exist').to.exist;
      });
  });
});
