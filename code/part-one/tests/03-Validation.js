'use strict';

const { expect } = require('chai');
const { randomBytes } = require('crypto');
const signing = require('../signing');
const { Transaction, Block, Blockchain } = require('../blockchain');
const validation = require('../validation');


// Tampers with a hex string, changing a single random character
const modifyHexString = hex => {
  const index = Math.floor(Math.random() * hex.length);

  let newChar = null;
  do {
    newChar = Math.floor(Math.random() * 16).toString(16);
  } while (newChar === hex[index]);

  return hex.slice(0, index) + newChar + hex.slice(index + 1);
};

// Creates a random transaction
const makeRandomTransaction = () => {
  const signer = signing.createPrivateKey();
  const recipient = signing.getPublicKey(signing.createPrivateKey());
  const amount = Math.ceil(Math.random() * 100);
  return new Transaction(signer, recipient, amount);
};

describe('Validation module', function() {

  describe('isValidTransaction', function() {
    let transaction = null;

    beforeEach(function() {
      transaction = makeRandomTransaction();
    });

    it('should return true for a valid transaction', function() {
      expect(validation.isValidTransaction(transaction)).to.be.true;
    });

    it('should return false when the amount is below zero', function() {
      const transaction = new Transaction(
        signing.createPrivateKey(),
        signing.getPublicKey(signing.createPrivateKey()),
        -100
      );

      expect(validation.isValidTransaction(transaction)).to.be.false;
    });

    it('should return false when signature is modified', function() {
      transaction.signature = modifyHexString(transaction.signature);
      expect(validation.isValidTransaction(transaction)).to.be.false;
    });

    it('should return false when source is modified', function() {
      transaction.source = signing.getPublicKey(signing.createPrivateKey());
      expect(validation.isValidTransaction(transaction)).to.be.false;
    });

    it('should return false when recipient is modified', function() {
      transaction.recipient = modifyHexString(transaction.recipient);
      expect(validation.isValidTransaction(transaction)).to.be.false;
    });

    it('should return false when amount is modified', function() {
      transaction.amount = transaction.amount + 1;
      expect(validation.isValidTransaction(transaction)).to.be.false;
    });
  });
});
