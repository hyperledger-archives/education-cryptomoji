let SHA512 = require('crypto-js/sha512');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this._nonce = 0;
  }

  // Calculate a hash based on data supplied to block
  calculateHash() {
    return SHA512(`${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}${this._nonce}`).toString();
  }

  // Mine block by difficulty
  mineBlock(difficulty) {
    console.log('Mining block...');
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this._nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`${'Block mined'} ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this._createGenesisBlock()];
    this._difficulty = 3;
  }

  // Create the initial block for the blockchain
  _createGenesisBlock() {
    return new Block(0, (new Date()).toString(), 'Genesis Block', '0');
  }

  // Get the last created block
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Add a new block to the blockchain
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this._difficulty);
    this.chain.push(newBlock);
  }

  // Check if the chain is valid
  isValidChain() {
    let validity = true;

    this.chain.forEach((block, i) => {
      const previousBlock = this.chain[i - 1];

      if (
        block.hash !== block.calculateHash() ||
        block.previousHash !== previousBlock.hash
      ) {
        validity = false;
      }
    });

    return validity;
  }
}
