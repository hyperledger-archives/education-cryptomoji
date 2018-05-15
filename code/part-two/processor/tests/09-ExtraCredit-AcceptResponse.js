'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('./services/handler_wrapper');
const {
  getCollectionAddress,
  getOfferAddress
} = require('./services/addressing');
const { encode, decode } = require('./services/encoding');
const Txn = require('./services/mock_txn');
const Context = require('./services/mock_context');


// EXTRA CREDIT: Remove `.skip` to test
describe.skip('Accept Response', function() {
  let handler = null;
  let context = null;
  let offer = null;
  let ownerPriv = null;
  let responderPriv = null;
  let ownerAddr = null;
  let responderAddr = null;
  let ownerDna = null;
  let responderDna = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    context = new Context();
    const ownerTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const responderTxn = new Txn({ action: 'CREATE_COLLECTION' });

    ownerPriv = ownerTxn._privateKey;
    responderPriv = responderTxn._privateKey;
    ownerAddr = getCollectionAddress(ownerTxn._publicKey);
    responderAddr = getCollectionAddress(responderTxn._publicKey);

    return handler.apply(responderTxn, context)
      .then(() => handler.apply(ownerTxn, context))
      .then(() => {
        const { moji } = decode(context._state[ownerAddr]);
        offer = getOfferAddress(ownerTxn._publicKey, moji);
        ownerDna = moji.map(m => decode(context._state[m]).dna);

        const offerTxn = new Txn({ action: 'CREATE_OFFER', moji }, ownerPriv);
        return handler.apply(offerTxn, context);
      })
      .then(() => {
        const { moji } = decode(context._state[responderAddr]);
        responderDna = moji.map(m => decode(context._state[m]).dna);
        const payload = { action: 'ADD_RESPONSE', moji, offer };
        const txn = new Txn(payload, responderPriv);

        return handler.apply(txn, context);
      });
  });

  it('should allow offer owners to accept responses', function() {
    const payload = { action: 'ACCEPT_RESPONSE', offer, response: 0 };
    const txn = new Txn(payload, ownerPriv);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[offer]).to.not.exist;

        const newOwnerDna = decode(context._state[ownerAddr]).moji
          .map(m => decode(context._state[m]).dna);
        const newResponderDna = decode(context._state[responderAddr]).moji
          .map(m => decode(context._state[m]).dna);

        expect(newOwnerDna.sort()).to.deep.equal(responderDna.sort());
        expect(newResponderDna.sort()).to.deep.equal(ownerDna.sort());
      });
  });

  it('should allow owners of response moji to accept responses', function() {
    const defaultOffer = decode(context._state[offer]);
    defaultOffer.responses = [];
    context._state[offer] = encode(defaultOffer);

    const { moji } = decode(context._state[responderAddr]);
    const addTxn = new Txn({ action: 'ADD_RESPONSE', moji, offer }, ownerPriv);

    const payload = { action: 'ACCEPT_RESPONSE', offer, response: 0 };
    const acceptTxn = new Txn(payload, responderPriv);

    return handler.apply(addTxn, context)
      .then(() => handler.apply(acceptTxn, context))
      .then(() => {
        expect(context._state[offer]).to.not.exist;

        const newOwnerDna = decode(context._state[ownerAddr]).moji
          .map(m => decode(context._state[m]).dna);
        const newResponderDna = decode(context._state[responderAddr]).moji
          .map(m => decode(context._state[m]).dna);

        expect(newOwnerDna.sort(), 'Owner should now have response moji')
          .to.deep.equal(responderDna.sort());
        expect(newResponderDna.sort(), 'Responder should now have owner moji')
          .to.deep.equal(ownerDna.sort());
      });
  });

  it('should accept responses that are one of many', function() {
    const defaultOffer = decode(context._state[offer]);
    defaultOffer.responses = [];
    context._state[offer] = encode(defaultOffer);

    const allMoji = decode(context._state[responderAddr]).moji;
    const getAddTxn = length => {
      const moji = allMoji.slice(0, length);
      const payload = { action: 'ADD_RESPONSE', moji, offer };
      return new Txn(payload, responderPriv);
    };

    const payload = { action: 'ACCEPT_RESPONSE', offer, response: 1 };
    const acceptTxn = new Txn(payload, ownerPriv);

    return handler.apply(getAddTxn(1), context)
      .then(() => handler.apply(getAddTxn(3), context))
      .then(() => handler.apply(getAddTxn(2), context))
      .then(() => handler.apply(acceptTxn, context))
      .then(() => {
        expect(context._state[offer]).to.not.exist;

        const newOwnerDna = decode(context._state[ownerAddr]).moji
          .map(m => decode(context._state[m]).dna);
        const newResponderDna = decode(context._state[responderAddr]).moji
          .map(m => decode(context._state[m]).dna);

        expect(newOwnerDna.sort(), 'Owner should now have response moji')
          .to.deep.equal(responderDna.sort());
        expect(newResponderDna.sort(), 'Responder should now have owner moji')
          .to.deep.equal(ownerDna.sort());
      });
  });

  it('should reject acceptances from key others than approver', function() {
    const payload = { action: 'ACCEPT_RESPONSE', offer, response: 0 };
    const txn = new Txn(payload, responderPriv);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        expect(context._state[offer]).to.not.be.empty;

        const newOwnerDna = decode(context._state[ownerAddr]).moji
          .map(m => decode(context._state[m]).dna);
        const newResponderDna = decode(context._state[responderAddr]).moji
          .map(m => decode(context._state[m]).dna);

        expect(newOwnerDna.sort(), 'Owner should still have their moji')
          .to.deep.equal(ownerDna.sort());
        expect(newResponderDna.sort(), 'Responder should still have their moji')
          .to.deep.equal(responderDna.sort());
      });
  });

  it('should reject acceptances for indexes with no response', function() {
    const payload = { action: 'ACCEPT_RESPONSE', offer, response: 1 };
    const txn = new Txn(payload, ownerPriv);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(wasRejected => {
        expect(context._state[offer]).to.not.be.empty;

        const newOwnerDna = decode(context._state[ownerAddr]).moji
          .map(m => decode(context._state[m]).dna);
        const newResponderDna = decode(context._state[responderAddr]).moji
          .map(m => decode(context._state[m]).dna);

        expect(newOwnerDna.sort(), 'Owner should still have their moji')
          .to.deep.equal(ownerDna.sort());
        expect(newResponderDna.sort(), 'Responder should still have their moji')
          .to.deep.equal(responderDna.sort());
      });
  });

  it('should reject acceptances when any moji have been moved', function() {
    delete context._state[decode(context._state[responderAddr]).moji[1]];
    const payload = { action: 'ACCEPT_RESPONSE', offer, response: 0 };
    const txn = new Txn(payload, ownerPriv);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        expect(context._state[offer]).to.not.be.empty;
      });
  });
});
