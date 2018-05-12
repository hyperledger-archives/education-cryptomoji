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

};

const breakChain = blockchain => {

};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
