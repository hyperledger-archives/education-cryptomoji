'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

const isValidTransaction = transaction => {
  if (transaction.amount < 0) {
    return false;
  }

  const toSign = transaction.source
    + transaction.recipient
    + transaction.amount;

  return signing.verify(transaction.source, toSign, transaction.signature);
};

const isValidBlock = block => {
  const transactionString = block.transactions.map(t => t.signature).join('');
  const toHash = block.previousHash + transactionString + block.nonce;

  if (block.hash !== createHash('sha512').update(toHash).digest('hex')) {
    return false;
  }

  return block.transactions.every(isValidTransaction);
};

const isValidChain = blockchain => {
  const { blocks } = blockchain;

  if (blocks[0].previousHash !== null) {
    return false;
  }

  if (blocks.slice(1).some((b, i) => b.previousHash !== blocks[i].hash)) {
    return false;
  }

  if (blocks.some(b => !isValidBlock(b))) {
    return false;
  }

  return blocks
    .map(b => b.transactions)
    .reduce((flat, txns) => flat.concat(txns), [])
    .every(isValidTransaction);
};

const breakChain = blockchain => {
  blockchain.blocks[1].transactions[0].amount = 1000000000;
};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
