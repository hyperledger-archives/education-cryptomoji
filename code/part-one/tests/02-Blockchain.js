'use strict';

const { expect } = require('chai');
const { createHash } = require('crypto');
const { Block, Blockchain, Transaction } = require('../blockchain.js');


// Returns a hex string SHA-512 hash of a string or Buffer
const hash = msg => createHash('sha512').update(msg).digest('hex');

// Test transaction data
const testFromAddress = hash('testFromAddress');
const testToAddress = hash('testToAddress');
const testAmount = '10.00';
const transaction = new Transaction(
  testFromAddress,
  testToAddress,
  testAmount
);

// Test blockchain data
const blockchain = new Blockchain();
const genesisBlock = blockchain.chain[0];
const newBlock = new Block();
const miningAddress = hash('miningAddress');
let timesMined = 0;

// Test block data
const testPreviousHash = '0123testPreviousHash';
const testTransactions = [];
const testNonce = 0;
const now = Date.now();
const block = new Block(now, testTransactions, testPreviousHash);
const testDataHash = hash(
  testPreviousHash + now + JSON.stringify(testTransactions) + testNonce
);

// Transaction tests
describe('Transaction', function() {
  it('Should create a transaction with all initial values', function() {
    expect(transaction.fromAddress).to.equal(testFromAddress);
    expect(transaction.toAddress).to.equal(testToAddress);
    expect(transaction.amount).to.equal(testAmount);
  });
});

// Blockchain tests
describe('Blockchain', function() {
  it('Should create a blockchain with a genesis block', function() {
    expect(genesisBlock.previousHash).to.be.null;
    expect(genesisBlock.timestamp).is.not.null;
  });

  it('Should be able to retrieve the latest block', function() {
    expect(blockchain.getLatestBlock()).to.equal(
      blockchain.chain[blockchain.chain.length - 1]
    );
  });

  it('Should be able to add pending transactions', function() {
    blockchain.addPendingTransaction(transaction);

    expect(blockchain.pendingTransactions).to.have.lengthOf(1);
  });

  it('Should be able to mine pending transactions', function() {
    blockchain.minePendingTransactions(miningAddress);
    timesMined++;

    expect(blockchain.chain).to.have.lengthOf(2);
    expect(blockchain.pendingTransactions).to.have.lengthOf(0);
  });

  it('Should be able to get balance for an address', function() {
    const addressBalance = blockchain.getBalanceOfAddress(miningAddress);

    expect(addressBalance).to.equal(blockchain.miningReward * timesMined);
  });

  it('Should create a valid blockchain', function() {
    expect(blockchain.isValidChain()).to.be.true;
  });
});

// Block tests
describe('Block', function() {
  it('Should create a block with all initial values', function() {
    expect(block.timestamp).to.equal(now);
    expect(block.previousHash).to.equal(testPreviousHash);
  });

  it('Should create a block that calculates hashes', function() {
    expect(block.hash).to.equal(testDataHash);
  });

  it('Should create a block that can be mined', function() {

    // If the initial hash meets the proof of work requirement
    if (block.hash[0] === '0') {
      expect(block.hash).to.equal(testDataHash);
      expect(block._nonce).to.equal(testNonce);

    // If not uses nonce to generate proof of work
    } else {
      block.mineBlock(1);

      expect(block.hash).to.not.equal(testDataHash);
      expect(block._nonce).to.not.equal(testNonce);
    }

  });
});
