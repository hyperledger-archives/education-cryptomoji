'use strict';

const MojiHandler = require('../../handler');


// A wrapper class to make testing MojiHandler's easier
class HandlerWrapper {
  constructor() {
    this.handler = new MojiHandler();
  }

  // This method may throw an error, or return a rejected Promise
  // It will be easier to test if we can guarantee it always returns a Promise
  apply(txn, context) {
    try {
      return this.handler.apply(txn, context);
    } catch (err) {
      return new Promise((_, reject) => reject(err));
    }
  }
}

module.exports = HandlerWrapper;
