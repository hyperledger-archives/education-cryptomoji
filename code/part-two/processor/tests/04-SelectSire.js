'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('./services/handler_wrapper');
const {
  getCollectionAddress,
  getSireAddress
} = require('./services/addressing');
const { decode } = require('./services/encoding');
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

  it('should list Sires at the correct address', function() {
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        expect(context._state[address]).to.exist;

        const listing = decode(context._state[address]);
        expect(listing.owner).to.equal(publicKey);
        expect(listing.sire).to.equal(sire);
      });
  });

  it('should reject public keys with no collection', function() {
    delete context._state[getCollectionAddress(publicKey)];
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });

  it('should reject listings with no sire', function() {
    const txn = new Txn({ action: 'SELECT_SIRE' }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction);
  });

  it('should reject sires that do not exist', function() {
    delete context._state[sire];
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });

  it('should reject public keys that do not own the sire', function() {
    const createTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const address = getSireAddress(createTxn._publicKey);
    const txn = new Txn({ action: 'SELECT_SIRE', sire }, createTxn._privateKey);
    const submission = handler.apply(createTxn, context)
      .then(() => handler.apply(txn, context));

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => expect(context._state[address]).to.not.exist);
  });
});
