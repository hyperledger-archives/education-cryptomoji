'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const Txn = require('./mocks/txn');
const Context = require('./mocks/context');


describe('Core MojiHandler Behavior', function() {
  let handler = null;
  let context = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    context = new Context();
  });

  it('should return a Promise', function() {
    const txn = new Txn({ hello: 'world' });
    const applyResult = handler.apply(txn, context);

    expect(applyResult, 'Apply should return a promise')
      .to.be.an.instanceOf(Promise);

    applyResult.catch(() => {});
  });

  it('should reject a poorly encoded payload', function() {
    const txn = new Txn({});
    // If not JSON stringified, an object will become `"[object Object]"`
    txn.payload = Buffer.from({ hello: 'world' }.toString());

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

  it('should reject an unknown action', function() {
    const txn = new Txn({ action: 'BAD' });

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
});
