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

  describe('isValidBlock', function() {
    let block = null;

    beforeEach(function() {
      const transactions = [ makeRandomTransaction() ];
      const previousHash = randomBytes(64).toString('hex');
      block = new Block(transactions, previousHash);
    });

    it('should return true for a valid block', function() {
      expect(validation.isValidBlock(block)).to.be.true;
    });

    it('should return false when hash is modified', function() {
      block.hash = modifyHexString(block.hash);
      expect(validation.isValidBlock(block)).to.be.false;
    });

    it('should return false when previousHash is modified', function() {
      block.previousHash = modifyHexString(block.previousHash);
      expect(validation.isValidBlock(block)).to.be.false;
    });

    it('should return false when nonce is modified', function() {
      block.nonce = block.nonce + 1;
      expect(validation.isValidBlock(block)).to.be.false;
    });

    it('should return false when a transaction is modified', function() {
      const transaction = block.transactions[0];
      transaction.amount = transaction.amount + 1;
      expect(validation.isValidBlock(block)).to.be.false;
    });

    it('should return false when tampering with calculateHash', function() {
      block.calculateHash = nonce => { block.nonce = nonce; };
      block.hash = modifyHexString(block.hash);
      expect(validation.isValidBlock(block)).to.be.false;
    });
  });

  describe('isValidChain', function() {
    let blockchain = null;

    beforeEach(function() {
      blockchain = new Blockchain();
      blockchain.addBlock([ makeRandomTransaction() ]);
      blockchain.addBlock([ makeRandomTransaction() ]);
      blockchain.addBlock([ makeRandomTransaction() ]);
    });

    it('should return true for a valid blockchain', function() {
      expect(validation.isValidChain(blockchain)).to.be.true;
    });

    it('should return false when a block is removed', function() {
      blockchain.blocks.splice(1, 1);
      expect(validation.isValidChain(blockchain)).to.be.false;
    });

    it('should return false when the genesis block is removed', function() {
      blockchain.blocks.shift();
      expect(validation.isValidChain(blockchain)).to.be.false;
    });

    it('should return false when a new block is inserted', function() {
      const transactions = [ makeRandomTransaction() ];
      const previousHash = blockchain.blocks[1].hash;
      const block = new Block(transactions, previousHash);
      blockchain.blocks.splice(2, 0, block);

      expect(validation.isValidChain(blockchain)).to.be.false;
    });

    it('should return false when a block is modified', function() {
      const block = blockchain.blocks[2];
      block.nonce = block.nonce + 1;
      expect(validation.isValidChain(blockchain)).to.be.false;
    });

    it('should return false when a transaction is modified', function() {
      const transaction = blockchain.blocks[1].transactions[0];
      transaction.amount = transaction.amount + 1;
      expect(validation.isValidChain(blockchain)).to.be.false;
    });
  });

  describe('breakChain', function() {
    let blockchain = null;

    beforeEach(function() {
      blockchain = new Blockchain();
      blockchain.addBlock([ makeRandomTransaction() ]);
      blockchain.addBlock([ makeRandomTransaction() ]);
      blockchain.addBlock([ makeRandomTransaction() ]);
    });

    it('should invalidate a valid blockchain', function() {
      validation.breakChain(blockchain);
      expect(validation.isValidChain(blockchain)).to.be.false;
    });
  });
});
