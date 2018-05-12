'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');
const { Block, Blockchain } = require('./blockchain');


class MineableTransaction {
  constructor(privateKey, recipient = null, amount) {
    const publicKey = signing.getPublicKey(privateKey);
    this.amount = amount;

    if (recipient !== null) {
      this.source = publicKey;
      this.recipient = recipient;
    } else {
      this.source = null;
      this.recipient = publicKey;
    }

    const toSign = this.source + this.recipient + amount;
    this.signature = signing.sign(privateKey, toSign);
  }
}

class MineableBlock extends Block {
  /*
    Initialize the block constructor

    **Note**
    The block should be initiated with
      - a timestamp
      - transactions
      - the previous block's hash
  */
  constructor(transactions, previousHash) {
    super(transactions, previousHash);
    this.hash = '';
    this.nonce = null;
  }
}

class MineableChain extends Blockchain {
  constructor() {
    super();
    const genesis = new MineableBlock([], null);
    this.blocks = [ genesis ];

    this.difficulty = 2;
    this.reward = 100;

    this._pending = [];
  }

  addBlock() {
    throw new Error('Must mine to add blocks to this blockchain');
  }

  addTransaction(transaction) {
    this._pending.push(transaction);
  }

  /*
    Add a new block to the blockchain based on pending transactions:

    Create function that:
      - Adds previousHash property to new block
      - Create hash (or mine block)
      - Adds block to the chain
      - Creates new pending transaction for mining reward
  */
  mine(privateKey) {
    const reward = new MineableTransaction(privateKey, null, this.reward);
    const pendingTransactions = this._pending.concat(reward);
    const previousHash = this.getHeadBlock().hash;

    const block = new Block(pendingTransactions, previousHash);
    const zeros = '0'.repeat(this.difficulty);
    let nonce = 0;

    while (block.hash.slice(0, this.difficulty) !== zeros) {
      block.calculateHash(nonce);
      nonce++;
    }

    this.blocks.push(block);
    this._pending = [];
  }
}

const isValidMineableChain = blockchain => {
  const zeros = '0'.repeat(blockchain.difficulty);
  const { blocks } = blockchain;

  if (blocks.slice(1).some(b => b.hash.slice(0, zeros.length) !== zeros)) {
    return false;
  }

  const balances = {};

  for (const { transactions } of blocks) {
    const rewards = transactions.filter(t => !t.source);

    if (rewards.length > 1) {
      return false;
    }

    if (rewards[0] && rewards[0].amount !== blockchain.reward) {
      return false;
    }

    for (const { source, recipient, amount } of transactions) {
      if (source) {
        balances[source] = balances[source] || 0;
        balances[source] = balances[source] - amount;

        if (balances[source] < 0) {
          return false;
        }
      }

      balances[recipient] = balances[recipient] || 0;
      balances[recipient] = balances[recipient] + amount;
    }
  }

  return true;
};

module.exports = {
  MineableTransaction,
  MineableBlock,
  MineableChain,
  isValidMineableChain
};
