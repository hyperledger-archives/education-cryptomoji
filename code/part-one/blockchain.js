const SHA512 = require('crypto-js/sha512');

class Block {
  /*
    Initialize the block constructor

    **Note**
    The block should be initiated with
      - an index
      - a timestamp
      - the stored data
      - the previous block's hash
  */
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this._nonce = 0;
    this.hash = this.calculateHash();
  }

  /*
    Calculate a hash based on data supplied to block:

    - Add functionality to return a hash by passing a compiled string
    into the SHA256 hashing function

    - The string that is passed in should contain specific data
    about the block that would be impossible to replicate

    **Hint**
    Unreplicable data can include
      - the block index
      - the previous hash
      - the block timestamp
  */
  calculateHash() {
    return SHA512(this.index + this.previousHash + this.timestamp +
      JSON.stringify(this.data) + this._nonce).toString();
  }

  /*
    Mine block by difficulty:

    - In order to mine using proof of work the calculateHash function
    needs to incorporate the nonce

    - The nonce should increase everytime the function loops
    until the number of zeros at the beginning of the hash
    matches the number that is passed in (difficulty)

    - The stored hash should be updated everytime the nonce increases
  */
  mineBlock(difficulty) {
    console.log('Mining block...');
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
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

  /*
    Create the initial block for the blockchain:

    - Add functionality to create an initial block
  */
  _createGenesisBlock() {
    return new Block(0, (new Date()).toString(), 'Genesis Block', '0');
  }

  /*
    Get the last created block:

    - Add functionality to get the latest block in the chain
  */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /*
    Add a new block to the blockchain:

    Create function that:
      - Adds previousHash property to new block
      - Create hash (or mine block)
      - Adds block to the chain
  */
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this._difficulty);
    this.chain.push(newBlock);
  }

  /*
    Check if the chain is valid:

    Add functionality that determines that:
      - Each block's hash in the chain is valid
      - Each block's previous hash property matches the previous block's hash
  */
  isValidChain() {
    return this.chain.every((block, i) => {
      const previousBlock = this.chain[i - 1];

      return (
        !previousBlock ||
        block.hash === block.calculateHash() ||
        block.previousHash === previousBlock.hash
      );
    });
  }
}

module.exports = { Blockchain, Block };
