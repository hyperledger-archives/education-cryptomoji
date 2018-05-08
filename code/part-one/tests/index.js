'use strict';

const chai = require('chai');


chai.Assertion.addProperty('hexString', function() {
  this.assert(
    typeof this._obj === 'string' && /^[0-9a-f]*$/.test(this._obj),
    'expected #{this} to be a hexadecimal string',
    'expected #{this} to not be a hexadecimal string'
  );
});
