'use strict';

const { TransactionProcessor } = require('sawtooth-sdk/processor');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const MojiHandler = require('./handler');


// Set validator URL, note that default not valid in docker-compose environment
const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004';

const tp = new TransactionProcessor(VALIDATOR_URL);
const handler = new MojiHandler();

// There is a bug in the Sawtooth SDK, which will cause the processor to crash
// if an error is thrown outside of a Promise. This will be fixed in version
// 1.0.5, but until then this workaround is necessary.
const baseApply = handler.apply;
handler.apply = (txn, context) => {
  try {
    return baseApply.call(handler, txn, context);
  } catch (err) {
    return new Promise((_, reject) => reject(err));
  }
};

// Add the handler and start the transaction processor
tp.addHandler(handler);
tp.start();
