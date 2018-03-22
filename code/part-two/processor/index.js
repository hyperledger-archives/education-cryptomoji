'use strict';

const { TransactionProcessor } = require('sawtooth-sdk/processor');
const MojiHandler = require('./handler');

const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004';

const tp = new TransactionProcessor(VALIDATOR_URL);
tp.addHandler(new MojiHandler());
tp.start();
