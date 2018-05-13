'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const getAddress = require('../services/addressing');
const { decode } = require('../services/helpers');
const Txn = require('./services/mock_txn');
const Context = require('./services/mock_context');

describe('Add Response', function() {
  let handler = null;
  let context = null;
  let offer = null;
  let ownerPub = null;
  let ownerPriv = null;
  let responderPub = null;
  let responderPriv = null;
  let moji = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    context = new Context();
    const ownerTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const responderTxn = new Txn({ action: 'CREATE_COLLECTION' });

    ownerPub = ownerTxn._publicKey;
    ownerPriv = ownerTxn._privateKey;
    responderPub = responderTxn._publicKey;
    responderPriv = responderTxn._privateKey;

    return handler.apply(responderTxn, context)
      .then(() => {
        const address = getAddress.collection(responderPub);
        moji = decode(context._state[address]).moji.sort();
        return handler.apply(ownerTxn, context);
      })
      .then(() => {
        const ownerAddress = getAddress.collection(ownerPub);
        const { moji } = decode(context._state[ownerAddress]);
        offer = getAddress.offer(ownerTxn._publicKey)(moji);

        const offerTxn = new Txn({ action: 'CREATE_OFFER', moji }, ownerPriv);
        return handler.apply(offerTxn, context);
      });
  });

  it('should add a response with multiple moji', function() {
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(txn, context)
      .then(() => {
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have one response').to.have.lengthOf(1);

        expect(responses[0].approver, 'Response should need owner approval')
          .to.equal(ownerPub);
        expect(responses[0].moji, 'Response should include the moji offered')
          .to.deep.equal(moji);
      });
  });

  it('should add a response with a single moji', function() {
    moji = moji.slice(0, 1);
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(txn, context)
      .then(() => {
        const responses = decode(context._state[offer]).responses;
        expect(responses, 'Offer should have one response').to.have.lengthOf(1);

        expect(responses[0].approver, 'Response should need owner approval')
          .to.equal(ownerPub);
        expect(responses[0].moji, 'Response should include the moji offered')
          .to.deep.equal(moji);
      });
  });

  it('should add a response from the offer owner', function() {
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, ownerPriv);

    return handler.apply(txn, context)
      .then(() => {
        const { responses } = decode(context._state[offer]);
        expect(responses[0].approver, 'Response should need responder approval')
          .to.equal(responderPub);
      });
  });

  it('should sort the moji in the response', function() {
    moji = moji.reverse();
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(txn, context)
      .then(() => {
        const { responses } = decode(context._state[offer]);
        expect(responses[0].moji, 'Response should sort the offered moji')
          .to.have.ordered.members(moji.sort());
      });
  });

  it('should reject responses identical to one previously added', function() {
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);
    const repeatTxn = new Txn({
      action: 'ADD_RESPONSE',
      moji: moji.reverse(),
      offer
    }, responderPriv);

    return handler.apply(txn, context)
      .then(() => handler.apply(repeatTxn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have one response').to.have.lengthOf(1);
      });
  });

  it('should not reject responses that are subsets or supersets', function() {
    const getAddTxn = l => {
      const payload = { action: 'ADD_RESPONSE', moji: moji.slice(0, l), offer };
      return new Txn(payload, responderPriv);
    };

    return handler.apply(getAddTxn(2), context)
      .then(() => handler.apply(getAddTxn(1), context))
      .then(() => handler.apply(getAddTxn(3), context))
      .then(() => {
        const { responses } = decode(context._state[offer]);
        expect(responses, 'There should be three responses')
          .to.have.lengthOf(3);
      });
  });

  it('should reject public keys with no Collection', function() {
    delete context._state[getAddress.collection(responderPub)];
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have no responses').to.be.empty;
      });
  });

  it('should reject a response when moji is not set', function() {
    const moji = [];
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have no responses').to.be.empty;
      });
  });

  it('should reject a response when offer is not set', function() {
    const txn = new Txn({ action: 'ADD_RESPONSE', moji }, responderPriv);

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

  it('should reject a response with a moji that does not exist', function() {
    delete context._state[moji[1]];
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have no responses').to.be.empty;
      });
  });

  it('should reject a response that includes a Sire', function() {
    const sire = moji[1];
    const sireTxn = new Txn({ action: 'SELECT_SIRE', sire }, responderPriv);
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

    return handler.apply(sireTxn, context)
      .then(() => handler.apply(txn, context))
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have no responses').to.be.empty;
      });
  });

  it('should reject a response with an offer that does not exist', function() {
    delete context._state[offer];
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, responderPriv);

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

  it("should reject a response with offer owner's moji", function() {
    const { moji } = decode(context._state[getAddress.collection(ownerPub)]);
    const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, ownerPriv);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have no responses').to.be.empty;
      });
  });

  it('should reject public keys that do not own offer or all moji', function() {
    const fraudTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const fraudPriv = fraudTxn._privateKey;
    const fraudPub = fraudTxn._publicKey;

    return handler.apply(fraudTxn, context)
      .then(() => {
        const fraud = decode(context._state[getAddress.collection(fraudPub)]);
        moji = fraud.moji.slice(0, 2).concat(moji.slice(0, 1));
        const txn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, fraudPriv);
        return handler.apply(txn, context);
      })
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const { responses } = decode(context._state[offer]);
        expect(responses, 'Offer should have no responses').to.be.empty;
      });
  });
});
