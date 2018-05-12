'use strict';

const { expect } = require('chai');
const { randomBytes } = require('crypto');
const signing = require('../signing');
const { Transaction, Block, Blockchain } = require('../blockchain');


describe('Blockchain module', function() {

  describe('Transaction', function() {
    let signer = null;
    let recipient = null;
    let amount = null;
    let transaction = null;

    beforeEach(function() {
      signer = signing.createPrivateKey();
      recipient = signing.getPublicKey(signing.createPrivateKey());
      amount = Math.ceil(Math.random() * 100);
      transaction = new Transaction(signer, recipient, amount);
    });

    it('should include signer public key as source', function() {
      expect(transaction.source).to.equal(signing.getPublicKey(signer));
    });

    it('should include the passed recipient and amount', function() {
      expect(transaction.recipient).to.equal(recipient);
      expect(transaction.amount).to.equal(amount);
    });

    it('should include a valid signature', function() {
      const { source, signature } = transaction;
      const signedMessage = source + recipient + amount;

      expect(signing.verify(source, signedMessage, signature)).to.be.true;
    });
  });

  describe('Block', function() {
    let previousHash = null;
    let transactions = null;
    let block = null;

    beforeEach(function() {
      const signer = signing.createPrivateKey();
      const recipient = signing.getPublicKey(signing.createPrivateKey());
      const amount = Math.ceil(Math.random() * 100);

      transactions = [ new Transaction(signer, recipient, amount) ];
      previousHash = randomBytes(64).toString('hex');

      block = new Block(transactions, previousHash);
    });

    it('should include the passed transactions', function() {
      expect(block.transactions).to.deep.equal(transactions);
    });

    it('should include the passed previous hash', function() {
      expect(block.previousHash).to.equal(previousHash);
    });

    it('should have a method that calculates a hash with a nonce', function() {
      block.calculateHash(0);
      expect(block.hash).to.be.a('string').and.not.be.empty;
      expect(block.nonce).to.equal(0);
    });

    it('should calculate the same hash with the same nonce', function() {
      block.calculateHash(0);
      const originalHash = block.hash;
      block.calculateHash(0);

      expect(block.hash).to.equal(originalHash);
    });

    it('should have different hashes for different nonces', function() {
      block.calculateHash(0);
      const originalHash = block.hash;
      block.calculateHash(1);

      expect(originalHash).to.not.equal(block.hash);
    });

    it('should have different hashes for different transactions', function() {
      block.calculateHash(0);
      const originalHash = block.hash;

      const signer = signing.createPrivateKey();
      const recipient = signing.getPublicKey(signing.createPrivateKey());
      const amount = Math.ceil(Math.random() * 100);
      const newTransaction = new Transaction(signer, recipient, amount);
      block.transactions.push(newTransaction);

      block.calculateHash(0);
      expect(block.hash).to.not.equal(originalHash);
    });

    it('should have different hashes for different prev hashes', function() {
      block.calculateHash(0);
      const originalHash = block.hash;

      block.previousHash = randomBytes(64).toString('hex');
      block.calculateHash(0);

      expect(block.hash).to.not.equal(originalHash);
    });
  });

  describe('Blockchain', function() {
    let blockchain = null;

    beforeEach(function() {
      blockchain = new Blockchain();
    });

    it('should have a blocks array with a genesis block', function() {
      expect(blockchain.blocks).to.exist.and.be.an('array');

      const genesis = blockchain.blocks[0];
      expect(genesis.previousHash).to.be.null;
      expect(genesis.transactions).to.be.an('array').and.be.empty;
    });

    it('should have a method to get the latest block', function() {
      expect(blockchain.getHeadBlock()).to.deep.equal(blockchain.blocks[0]);
    });

    it('should be able to build a new block from transactions', function() {
      const signer = signing.createPrivateKey();
      const recipient = signing.getPublicKey(signing.createPrivateKey());
      const transaction = new Transaction(signer, recipient, 100);
      blockchain.addBlock([transaction]);

      expect(blockchain.blocks).to.have.lengthOf(2);
      expect(blockchain.getHeadBlock().transactions)
        .to.deep.equal([transaction]);
    });

    it('should be able to get balance for an address', function() {
      const signer = signing.createPrivateKey();
      const recipient = signing.getPublicKey(signing.createPrivateKey());
      const transaction = new Transaction(signer, recipient, 100);
      blockchain.addBlock([transaction]);

      expect(blockchain.getBalance(recipient)).to.equal(100);
      expect(blockchain.getBalance(signing.getPublicKey(signer)))
        .to.equal(-100);
    });

    it('should return a balance of zero for an unknown address', function() {
      const unknown = signing.getPublicKey(signing.createPrivateKey());
      expect(blockchain.getBalance(unknown)).to.equal(0);
    });
  });
});
