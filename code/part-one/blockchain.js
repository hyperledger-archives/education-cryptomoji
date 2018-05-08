'use strict';

const { createHash } = require('crypto');


// Returns a hex string SHA-512 hash of a string or Buffer
const hash = msg => createHash('sha512').update(msg).digest('hex');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  /*
    Initialize the block constructor

    **Note**
    The block should be initiated with
      - a timestamp
      - transactions
      - the previous block's hash
  */
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this._nonce = 0;
    this.hash = this.calculateHash();
  }

  /*
    Calculate a hash based on transactions supplied to block:

    - Add functionality to return a hash by passing a compiled string
    into the SHA256 hashing function

    - The string that is passed in should contain specific data
    about the block that would be impossible to replicate

    **Hint**
    Unreplicable data can include
      - transactions
      - the previous hash
      - the block timestamp
  */
  calculateHash() {
    return hash(this.previousHash + this.timestamp +
      JSON.stringify(this.transactions) + this._nonce.toString());
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
    this._difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  /*
    Create the initial block for the blockchain:

    - Add functionality to create an initial block
  */
  _createGenesisBlock() {
    return new Block(Date.now(), [], null);
  }

  /*
    Get the last created block:

    - Add functionality to get the latest block in the chain
  */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /*
    Add a new block to the blockchain based on pending transactions:

    Create function that:
      - Adds previousHash property to new block
      - Create hash (or mine block)
      - Adds block to the chain
      - Creates new pending transaction for mining reward
  */
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(), this.pendingTransactions, this.getLatestBlock().hash
    );

    /*
      Mining rewards do not come from any specific address
      and instead are awarded directly from the chain itself.
    */
    block.transactions.push(
      new Transaction(null, miningRewardAddress, this.miningReward)
    );

    block.mineBlock(this._difficulty);

    this.chain.push(block);
    this.pendingTransactions = [];
    console.log('Block has been mined.');
  }

  addPendingTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  /*
    Takes in an address and should return the balance of that address based on
    the mined transactions in the blockchain.
  */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
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

module.exports = {
  Transaction,
  Block,
  Blockchain
};
