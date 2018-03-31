const chai = require('chai');
const expect = chai.expect;
const SHA512 = require('crypto-js/sha512');
const { Block, Blockchain } = require('./blockchain.js');

describe('Blockchain', () => {
  const blockchain = new Blockchain();
  const now = new Date().toString();
  const genesisBlock = blockchain.chain[0];
  const newBlock = new Block();

  it('Should create a blockchain with a genesis block', done => {
    expect(blockchain).to.have.property('_createGenesisBlock');
    expect(blockchain).to.have.property('chain').with.lengthOf(1);
    expect(genesisBlock.previousHash).to.equal('0');
    expect(genesisBlock.timestamp).to.equal(now);
    done();
  });

  // it('Should create a blockchain that can add blocks', done => {
  //   blockchain.addBlock(newBlock);

  //   expect(blockchain).to.have.property('addBlock');
  //   expect(blockchain).to.have.property('_difficulty');
  //   expect(blockchain.chain).to.have.lengthOf(2);
  //   expect(blockchain.chain[1]).to.equal(newBlock);
  //   done();
  // });

  it('Should create a valid blockchain', done => {
    expect(blockchain).to.have.property('isValidChain');
    expect(blockchain.isValidChain()).to.be.true;
    done();
  });

  // it('Should create a blockchain that can retrieve the latest block', done => {
  //   expect(blockchain).to.have.property('getLatestBlock');
  //   expect(blockchain.getLatestBlock()).to.equal(newBlock);
  //   done();
  // });
});

describe('Block', () => {
  const now = new Date().toString();
  const testHash = '0123TESTHASH';
  const testTransactions = [];
  const testNonce = 0;

  const block = new Block(now, testTransactions, testHash);

  const testDataHash = SHA512(testHash + now +
    JSON.stringify(testTransactions) + testNonce).toString();

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
