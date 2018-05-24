'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that have negative
 * amounts, were improperly signed, or that have been modified since signing.
 */
const isValidTransaction = transaction => {
  // Enter your solution here

};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if their hash or any other properties were altered,
 * or if they contain any invalid transactions.
 */
const isValidBlock = block => {
  // Your code here

};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. There are a few conditions that should cause a blockchain
 * to be rejected:
 *   - missing genesis block
 *   - any block besides genesis has a null hash
 *   - any block besides genesis has a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  // Your code here

};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  // Your code here

};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
