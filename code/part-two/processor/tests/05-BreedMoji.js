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


describe('Breed Moji', function() {
  let handler = null;
  let context = null;
  let privateKey = null;
  let publicKey = null;
  let sireOwnerKey = null;
  let sire = null;
  let breeder = null;

  before(function() {
    handler = new MojiHandler();
  });

  beforeEach(function() {
    const sireOwnerTxn = new Txn({ action: 'CREATE_COLLECTION' });
    const breederOwnerTxn = new Txn({ action: 'CREATE_COLLECTION' });
    context = new Context();
    privateKey = breederOwnerTxn._privateKey;
    publicKey = breederOwnerTxn._publicKey;
    sireOwnerKey = sireOwnerTxn._publicKey;

    return Promise.all([
      handler.apply(sireOwnerTxn, context),
      handler.apply(breederOwnerTxn, context)
    ])
      .then(() => {
        const sireOwnerAddress = getCollectionAddress(sireOwnerKey);
        const breederOwnerAddress = getCollectionAddress(publicKey);

        sire = decode(context._state[sireOwnerAddress]).moji[0];
        breeder = decode(context._state[breederOwnerAddress]).moji[0];

        const privateKey = sireOwnerTxn._privateKey;
        const sireTxn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);
        return handler.apply(sireTxn, context);
      });
  });

  it("should create a new moji for breeders' owners", function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(4);

        const child = decode(context._state[owner.moji[3]]);

        expect(child.owner).to.equal(publicKey);
        expect(child.sire).to.equal(sire);
        expect(child.breeder).to.equal(breeder);
      });
  });

  it('should list new a sired moji on sires', function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const sireMoji = decode(context._state[sire]);
        expect(sireMoji.sired).to.have.lengthOf(1);
        expect(sireMoji.bred).to.be.empty;
      });
  });

  it('should add a new bred moji for breeders', function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const breederMoji = decode(context._state[breeder]);
        expect(breederMoji.bred).to.have.lengthOf(1);
        expect(breederMoji.sired).to.be.empty;
      });
  });

  it('should reject public keys with no collection', function() {
    delete context._state[getCollectionAddress(publicKey)];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction);
  });

  it('should reject breedings with no sire', function() {
    const txn = new Txn({ action: 'BREED_MOJI', breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });

  it('should reject sires that do not exist', function() {
    delete context._state[sire];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });

  it('should reject breedings with no breeder', function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });

  it('should reject breeders that do not exist', function() {
    delete context._state[breeder];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });

  it('should reject sires when there is no listing', function() {
    delete context._state[getSireAddress(sireOwnerKey)];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });

  it('should reject sires when another moji is listed', function() {
    const ownerAddress = getCollectionAddress(sireOwnerKey);
    const sire = decode(context._state[ownerAddress]).moji[1];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });

  it('should reject breeders not owned by the signer', function() {
    const sireOwnerAddress = getCollectionAddress(sireOwnerKey);
    const sireOwner = decode(context._state[sireOwnerAddress]);
    const breeder = sireOwner.moji[1];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);
    const submission = handler.apply(txn, context);

    return expect(submission).to.be.rejectedWith(InvalidTransaction)
      .then(() => {
        const owner = decode(context._state[getCollectionAddress(publicKey)]);
        expect(owner.moji).to.have.lengthOf(3);
      });
  });
});
