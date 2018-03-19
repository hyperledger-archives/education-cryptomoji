'use strict';

// A mock state context object for testing
class Context {
  constructor() {
    this.state = {};
  }

  getState(addresses) {
    return new Promise(resolve => {
      resolve(addresses.reduce((results, addr) => {
        results[addr] = this.state[addr] || [];
        return results;
      }, {}));
    });
  }

  setState (changes) {
    return new Promise(resolve => {
      const addresses = Object.keys(changes);
      addresses.forEach(addr => { this.state[addr] = changes[addr]; });
      resolve(addresses);
    });
  }
}

module.exports = Context;
