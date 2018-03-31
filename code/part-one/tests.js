const chai = require('chai');
const expect = chai.expect;
const SHA512 = require('crypto-js/sha512');
const { Block, Blockchain, Transaction } = require('./blockchain.js');


// Test transaction data
const testFromAddress = SHA512('testFromAddress').toString();
const testToAddress = SHA512('testToAddress').toString();
const testAmount = '10.00';
const transaction = new Transaction(
  testFromAddress,
  testToAddress,
  testAmount
);

// Test blockchain data
const blockchain = new Blockchain();
const now = new Date().toString();
const genesisBlock = blockchain.chain[0];
const newBlock = new Block();
const miningAddress = SHA512('miningAddress').toString();
let timesMined = 0;

// Test block data
const testHash = '0123TESTHASH';
const testTransactions = [];
const testNonce = 0;
const block = new Block(now, testTransactions, testHash);
const testDataHash = SHA512(
  testHash + now + JSON.stringify(testTransactions) + testNonce
).toString();


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
    expect(blockchain).to.have.property('_createGenesisBlock');
    expect(blockchain).to.have.property('chain').with.lengthOf(1);
    expect(genesisBlock.previousHash).to.equal('0');
    expect(genesisBlock.timestamp).to.equal(now);
    done();
  });

  it('Should be able to retrieve the latest block', done => {
    expect(blockchain).to.have.property('getLatestBlock');
    expect(blockchain.getLatestBlock()).to.equal(
      blockchain.chain[blockchain.chain.length - 1]
    );
    done();
  });

  it('Should be able to add pending transactions', done => {
    blockchain.addPendingTransaction(transaction);

    expect(blockchain).to.have.property('addPendingTransaction');
    expect(blockchain).to.have.property('_difficulty');
    expect(blockchain.pendingTransactions).to.have.lengthOf(1);
    done();
  });

  it('Should be able to mine pending transactions', done => {
    blockchain.minePendingTransactions(miningAddress);
    timesMined++;

    expect(blockchain).to.have.property('minePendingTransactions');
    expect(blockchain.chain).to.have.lengthOf(2);
    expect(blockchain.pendingTransactions).to.have.lengthOf(0);
    done();
  });

  it('Should be able to get balance for an address', done => {
    const addressBalance = blockchain.getBalanceOfAddress(miningAddress);

    expect(blockchain).to.have.property('getBalanceOfAddress');
    expect(addressBalance).to.equal(blockchain.miningReward * timesMined);
    done();
  });

  it('Should create a valid blockchain', done => {
    expect(blockchain).to.have.property('isValidChain');
    expect(blockchain.isValidChain()).to.be.true;
    done();
  });
});

// Block tests
describe('Block', () => {
  it('Should create a block with all initial values', done => {
    expect(block.timestamp).to.equal(now);
    expect(block.previousHash).to.equal(testHash);
    done();
  });

  it('Should create a block that calculates hashes', done => {
    expect(block).to.have.property('calculateHash');
    expect(block.hash).to.equal(testDataHash);
    done();
  });

  it('Should create a block than can be mined', done => {
    expect(block).to.have.property('mineBlock');

    block.mineBlock(1);

    expect(block.hash).to.not.equal(testDataHash);
    expect(block._nonce).to.not.equal(testNonce);
    done();
  });
});
