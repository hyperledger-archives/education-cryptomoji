'use strict';

const { TransactionProcessor } = require('sawtooth-sdk/processor');
const MojiHandler = require('./handler');


// The default validator URL, not valid in a docker-compose environment
const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004';

// Instantiate the processor with a MojiHandler and start it
const tp = new TransactionProcessor(VALIDATOR_URL);
tp.addHandler(new MojiHandler());
tp.start();
