'use strict';

const processor = require('sawtooth-sdk/processor');
const handler = require('./handler');

const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004';

const tp = new processor.TransactionProcessor(VALIDATOR_URL);
tp.addHandler(new handler.MojiHandler());
tp.start();
