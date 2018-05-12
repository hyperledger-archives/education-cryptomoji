'use strict';

const { expect } = require('chai');
const { randomBytes } = require('crypto');
const signing = require('../signing');
const {
  MineableTransaction,
  MineableBlock,
  MineableChain
} = require('../mining');


describe('Mining module', function() {

  describe('MineableTransaction', function() {
    let signer = null;
    let recipient = null;
    let amount = null;
    let transaction = null;

    beforeEach(function() {
      signer = signing.createPrivateKey();
      recipient = signing.getPublicKey(signing.createPrivateKey());
      amount = Math.ceil(Math.random() * 100);
      transaction = new MineableTransaction(signer, recipient, amount);
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

    it('should create a reward by making signer the recipient', function() {
      const reward = new MineableTransaction(signer, null, amount);

      expect(reward.source).to.equal(null);
      expect(reward.recipient).to.equal(signing.getPublicKey(signer));
    });
  });

  describe('MineableBlock', function() {
    let previousHash = null;
    let transactions = null;
    let block = null;

    beforeEach(function() {
      const signer = signing.createPrivateKey();
      const recipient = signing.getPublicKey(signing.createPrivateKey());
      const amount = Math.ceil(Math.random() * 100);

      transactions = [ new MineableTransaction(signer, recipient, amount) ];
      previousHash = randomBytes(64).toString('hex');

      block = new MineableBlock(transactions, previousHash);
    });

    it('should be instantiated without a hash', function() {
      expect(!!block.hash).to.be.false;
    });

  });

  describe('MineableChain', function() {
    let blockchain = null;
    let transaction = null;
    let miner = null;

    beforeEach(function() {
      blockchain = new MineableChain();

      const signer = signing.createPrivateKey();
      const recipient = signing.getPublicKey(signing.createPrivateKey());
      const amount = Math.ceil(Math.random() * 100);
      transaction = new MineableTransaction(signer, recipient, amount);

      miner = signing.createPrivateKey();
      blockchain.addTransaction(transaction);
      blockchain.mine(miner);
    });

    it('should have properties for difficulty and reward', function() {
      expect(blockchain.difficulty).to.exist.and.be.a('number');
      expect(blockchain.reward).to.exist.and.be.a('number');
    });

    it('should be able to mine new blocks', function() {
      expect(blockchain.blocks).to.have.lengthOf(2);

      const head = blockchain.getHeadBlock();
      expect(head.transactions).to.deep.include(transaction);
    });

    it('should mine blocks with a valid zero-leading hash', function() {
      const head = blockchain.getHeadBlock();
      const zeros = '0'.repeat(blockchain.difficulty);

      expect(head.hash).to.be.a('string').and.not.be.empty;
      expect(head.hash.slice(0, zeros.length)).to.equal(zeros);

      const copy = new MineableBlock(head.transactions, head.previousHash);
      copy.calculateHash(head.nonce);
      expect(copy.hash).to.equal(head.hash);
    });

    it('should include a transaction rewarding the miner', function() {
      const { transactions } = blockchain.getHeadBlock();
      const reward = transactions.find(transaction => {
        return transaction.recipient === signing.getPublicKey(miner);
      });

      expect(reward).to.not.be.undefined;
      expect(reward.source).to.be.null;
      expect(reward.amount).to.equal(blockchain.reward);
    });

    it('should not add transactions to the chain until mined', function() {
      const originalHead = blockchain.getHeadBlock();
      blockchain.addTransaction(new MineableTransaction(
        signing.createPrivateKey(),
        signing.getPublicKey(signing.createPrivateKey()),
        Math.ceil(Math.random() * 100)
      ));

      expect(originalHead).to.deep.equal(blockchain.getHeadBlock());
    });

    it('should clear out pending transactions after mining', function() {
      // Add a transaction so we can mine a new block
      blockchain.addTransaction(new MineableTransaction(
        signing.createPrivateKey(),
        signing.getPublicKey(signing.createPrivateKey()),
        Math.ceil(Math.random() * 100)
      ));
      blockchain.mine(miner);

      const head = blockchain.getHeadBlock();
      expect(head.transactions).to.not.deep.include(transaction);
    });
  });
});
