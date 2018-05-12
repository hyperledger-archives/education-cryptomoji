'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');


class Transaction {
  constructor(privateKey, recipient, amount) {
    this.source = signing.getPublicKey(privateKey);
    this.recipient = recipient;
    this.amount = amount;

    const toSign = this.source + recipient + amount;
    this.signature = signing.sign(privateKey, toSign);
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
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.calculateHash(0);
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
  calculateHash(nonce) {
    const transactionString = this.transactions.map(t => t.signature).join('');
    const toHash = this.previousHash + transactionString + nonce;
    this.nonce = nonce;
    this.hash = createHash('sha512').update(toHash).digest('hex');
  }
}

class Blockchain {
  constructor() {
    const genesis = new Block([], null);
    this.blocks = [ genesis ];
  }

  /*
    Get the last created block:

    - Add functionality to get the latest block in the chain
  */
  getHeadBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  addBlock(transactions) {
    const block = new Block(transactions, this.getHeadBlock().hash);
    this.blocks.push(block);
  }

  /*
    Takes in an address and should return the balance of that address based on
    the mined transactions in the blockchain.
  */
  getBalance(publicKey) {
    return this.blocks.reduce((balance, block) => {
      return balance + block.transactions.reduce((sum, transaction) => {
        if (transaction.recipient === publicKey) {
          return sum + transaction.amount;
        }
        if (transaction.source === publicKey) {
          return sum - transaction.amount;
        }
        return sum;
      }, 0);
    }, 0);
  }
}

module.exports = {
  Transaction,
  Block,
  Blockchain
};
