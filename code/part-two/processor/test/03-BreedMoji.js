'use strict';

const { expect } = require('chai');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const MojiHandler = require('../handler');
const getAddress = require('../utils/addressing');
const { decode } = require('../utils/helpers');
const Txn = require('./mocks/txn');
const Context = require('./mocks/context');

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
        const sireOwnerAddress = getAddress.collection(sireOwnerKey);
        const breederOwnerAddress = getAddress.collection(publicKey);

        sire = decode(context._state[sireOwnerAddress]).moji[0];
        breeder = decode(context._state[breederOwnerAddress]).moji[0];

        const privateKey = sireOwnerTxn._privateKey;
        const sireTxn = new Txn({ action: 'SELECT_SIRE', sire }, privateKey);
        return handler.apply(sireTxn, context);
      });
  });

  it("should create a new moji for the breeder's owner", function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should have four cryptomoji')
          .to.have.lengthOf(4);

        const child = decode(context._state[owner.moji[3]]);

        expect(child.owner, "Child moji should include the owner's public key")
          .to.equal(publicKey);
        expect(child.sire, "Child moji should include the sire's address")
          .to.equal(sire);
        expect(child.breeder, "Child moji should include the breeder's address")
          .to.equal(breeder);
      });
  });

  it('should add a new sired moji for the sire', function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const sireMoji = decode(context._state[sire]);
        expect(sireMoji.sired, 'Sire should have one sired moji')
          .to.have.lengthOf(1);
        expect(sireMoji.bred, 'Sire should still not have bred')
          .to.be.empty;
      });
  });

  it('should add a new bred moji for the breeder', function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .then(() => {
        const breederMoji = decode(context._state[breeder]);
        expect(breederMoji.bred, 'Breeder should have one bred moji')
          .to.have.lengthOf(1);
        expect(breederMoji.sired, 'Breeder should still not have sired')
          .to.be.empty;
      });
  });

  it('should reject public keys with no Collection', function() {
    delete context._state[getAddress.collection(publicKey)];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

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

  it('should reject breedings with no sire', function() {
    const txn = new Txn({ action: 'BREED_MOJI', breeder }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });

  it('should reject sires that do not exist', function() {
    delete context._state[sire];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });

  it('should reject breedings with no breeder', function() {
    const txn = new Txn({ action: 'BREED_MOJI', sire }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });

  it('should reject breeders that do not exist', function() {
    delete context._state[breeder];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });

  it('should reject sires when there is no listing', function() {
    delete context._state[getAddress.sireListing(sireOwnerKey)];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });

  it('should reject sires when another moji is listed', function() {
    const ownerAddress = getAddress.collection(sireOwnerKey);
    const sire = decode(context._state[ownerAddress]).moji[1];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });

  it('should reject breeders not owned by the signer', function() {
    const sireOwnerAddress = getAddress.collection(sireOwnerKey);
    const sireOwner = decode(context._state[sireOwnerAddress]);
    const breeder = sireOwner.moji[1];
    const txn = new Txn({ action: 'BREED_MOJI', sire, breeder }, privateKey);

    return handler.apply(txn, context)
      .catch(err => {
        expect(err, 'Error should be an InvalidTransaction')
          .to.be.instanceOf(InvalidTransaction);
        return true;
      })
      .then(wasRejected => {
        expect(wasRejected, 'Transaction should be rejected').to.be.true;
        const owner = decode(context._state[getAddress.collection(publicKey)]);
        expect(owner.moji, 'Owner should still have just three cryptomoji')
          .to.have.lengthOf(3);
      });
  });
});
