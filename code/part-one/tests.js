const chai = require('chai');
const expect = chai.expect;


const { Block, Blockchain } = require('./blockchain.js');

describe('Blockchain', () => {

  const blockchain = new Blockchain();
  const now = new Date().toString();
  const genesisBlock = blockchain.chain[0];

  it('Should create a blockchain with all initial values', done => {
    expect(blockchain).to.have.property('chain').with.lengthOf(1);
    expect(blockchain).to.have.property('_difficulty');
    expect(blockchain).to.have.property('_createGenesisBlock');
    expect(blockchain).to.have.property('getLatestBlock');
    expect(blockchain).to.have.property('addBlock');
    expect(blockchain).to.have.property('isValidChain');
    done();
  });

  it('Should create a blockchain with a genesis block', done => {
    expect(blockchain).to.have.property('_createGenesisBlock');
    expect(genesisBlock.index).to.equal(0);
    expect(genesisBlock.data).to.equal('Genesis Block');
    expect(genesisBlock.previousHash).to.equal('0');
    expect(genesisBlock.timestamp).to.equal(now);
    done();
  });

  it('Should create a valid blockchain', done => {
    expect(blockchain.isValidChain()).to.be.true;
    done();
  });

  it('Should create a blockchain that can retrieve the latest block', done => {
    expect(blockchain.getLatestBlock()).to.equal(genesisBlock);
    done();
  });

  it('Should create a blockchain that can add blocks', done => {

    const block = new Block();
    blockchain.addBlock(block);

    expect(blockchain.chain).to.have.lengthOf(2);
    expect(blockchain.chain[1]).to.equal(block);
    done();
  });

});