'use strict';

// A mock state context object for testing
class Context {
  constructor() {
    this._state = {};
  }

  getState(addresses) {
    return new Promise(resolve => {
      resolve(addresses.reduce((results, addr) => {
        results[addr] = this._state[addr] || [];
        return results;
      }, {}));
    });
  }

  setState(changes) {
    return new Promise(resolve => {
      const addresses = Object.keys(changes);
      addresses.forEach(addr => { this._state[addr] = changes[addr]; });
      resolve(addresses);
    });
  }

  deleteState(addresses) {
    return new Promise(resolve => {
      addresses.forEach(address => { delete this._state[address]; });
      resolve(addresses);
    });
  }
}

module.exports = Context;
