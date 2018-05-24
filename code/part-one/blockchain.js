'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');


/**
 * A simple signed Transaction class for sending funds from the signer to
 * another public key.
 */
class Transaction {
  /**
   * The constructor accepts a hex private key for the sender, a hex
   * public key for the recipient, and a number amount. It will use these
   * to set a number of properties, including a Secp256k1 signature.
   *
   * Properties:
   *   - source: the public key derived from the passed in private key
   *   - recipient: the passed public key for the recipient
   *   - amount: the passed in number
   *   - signature: a unique signature generated from a combination of the
   *     other properties, signed by the passed in private key
   */
  constructor(privateKey, recipient, amount) {
    // Enter your solution here

  }
}

/**
 * A Block class for storing an array of transactions and the hash of a
 * previous block. Includes a method to calculate and set its own hash.
 */
class Block {
  /**
   * Accepts an array of transactions and the hash of a previous block. It
   * saves these and uses them to calculate a hash.
   *
   * Properties:
   *   - transactions: the passed in transactions
   *   - previousHash: the passed in hash
   *   - nonce: just set this to some hard-coded number for now, it will be
   *     used later when we make blocks mineable with our own PoW algorithm
   *   - hash: a unique hash string generated from the other properties
   */
  constructor(transactions, previousHash) {
    // Your code here

    // start solution
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.calculateHash(0);
    // END SOLUTION
  }

  /**
   * Accepts a nonce, and generates a unique hash for the block. Updates the
   * hash and nonce properties of the block accordingly.
   *
   * Hint:
   *   The format of the hash is up to you. Remember that it needs to be
   *   unique and deterministic, and must become invalid if any of the block's
   *   properties change.
   */
  calculateHash(nonce) {
    // Your code here

    // start solution
    const transactionString = this.transactions.map(t => t.signature).join('');
    const toHash = this.previousHash + transactionString + nonce;

    this.nonce = nonce;
    this.hash = createHash('sha512').update(toHash).digest('hex');
    // END SOLUTION
  }
}

/**
 * A Blockchain class for storing an array of blocks, each of which is linked
 * to the previous block by their hashes. Includes methods for adding blocks,
 * fetching the head block, and checking the balances of public keys.
 */
class Blockchain {
  /**
   * Generates a new blockchain with a single genesis block. A genesis block
   * is important so later blocks have something to build off of. It should
   * have no transactions, and `null` for a previous hash.
   *
   * Properties:
   *   - blocks: an array of blocks, starts with one genesis block
   */
  constructor() {
    // Your code here

    // start solution
    const genesis = new Block([], null);
    this.blocks = [ genesis ];
    // END SOLUTION
  }

  /**
   * Simply returns the last block added to the chain.
   */
  getHeadBlock() {
    // Your code here

    // start solution
    return this.blocks[this.blocks.length - 1];
    // END SOLUTION
  }

  /**
   * Accepts an array of transactions, creating a new block with them, and
   * adding it to the chain.
   */
  addBlock(transactions) {
    // Your code here

    // start solution
    const block = new Block(transactions, this.getHeadBlock().hash);
    this.blocks.push(block);
    // END SOLUTION
  }

  /**
   * Accepts a public key and calculates its "balance" based on the amounts
   * transfered in transactions stored in the chain.
   *
   * Note:
   *   There is currently no way to add value to the chain, so inevitably some
   *   keys will have a negative balance. That's okay, we'll address it when
   *   we make the blockchain mineable later.
   */
  getBalance(publicKey) {
    // Your code here

    // start solution
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
    // END SOLUTION
  }
}

module.exports = {
  Transaction,
  Block,
  Blockchain
};
