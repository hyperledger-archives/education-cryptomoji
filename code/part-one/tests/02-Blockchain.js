const chai = require('chai');
const expect = chai.expect;
const { hash } = require('../utils/helpers.js');
const { Block, Blockchain, Transaction } = require('../blockchain.js');


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
describe('Transaction', () => {
  it('Should create a transaction with all initial values', done => {
    expect(transaction.fromAddress).to.equal(testFromAddress);
    expect(transaction.toAddress).to.equal(testToAddress);
    expect(transaction.amount).to.equal(testAmount);
    done();
  });
});

// Blockchain tests
describe('Blockchain', () => {
  it('Should create a blockchain with a genesis block', done => {
    expect(genesisBlock.previousHash).to.be.null;
    expect(genesisBlock.timestamp).is.not.null;
    done();
  });

  it('Should be able to retrieve the latest block', done => {
    expect(blockchain.getLatestBlock()).to.equal(
      blockchain.chain[blockchain.chain.length - 1]
    );
    done();
  });

  it('Should be able to add pending transactions', done => {
    blockchain.addPendingTransaction(transaction);

    expect(blockchain.pendingTransactions).to.have.lengthOf(1);
    done();
  });

  it('Should be able to mine pending transactions', done => {
    blockchain.minePendingTransactions(miningAddress);
    timesMined++;

    expect(blockchain.chain).to.have.lengthOf(2);
    expect(blockchain.pendingTransactions).to.have.lengthOf(0);
    done();
  });

  it('Should be able to get balance for an address', done => {
    const addressBalance = blockchain.getBalanceOfAddress(miningAddress);

    expect(addressBalance).to.equal(blockchain.miningReward * timesMined);
    done();
  });

  it('Should create a valid blockchain', done => {
    expect(blockchain.isValidChain()).to.be.true;
    done();
  });
});

// Block tests
describe('Block', () => {
  it('Should create a block with all initial values', done => {
    expect(block.timestamp).to.equal(now);
    expect(block.previousHash).to.equal(testPreviousHash);
    done();
  });

  it('Should create a block that calculates hashes', done => {
    expect(block.hash).to.equal(testDataHash);
    done();
  });

  it('Should create a block that can be mined', done => {

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

    done();
  });
});
