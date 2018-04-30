import './01-Signing.js';
import './02-Encoding.js';
import './03-Transactions.js';
import './04-Addressing.js';


chai.Assertion.addProperty('hexString', function() {
  this.assert(
    typeof this._obj === 'string' && /^[0-9a-f]*$/.test(this._obj),
    'expected #{this} to be a hexadecimal string',
    'expected #{this} to not be a hexadecimal string'
  );
});

chai.Assertion.addProperty('bytes', function() {
  this.assert(
    this._obj instanceof Buffer || this._obj instanceof Uint8Array,
    'expected #{this} to be a Buffer or Uint8array',
    'expected #{this} to not be a Buffer or Uint8array'
  );
});

// Unset protobuf properties have falsey defaults like 0, '', [], or {}
chai.Assertion.addProperty('set', function() {
  const obj = this._obj;
  this.assert(
    !!obj && (typeof obj !== 'object' || Object.keys(obj).length > 0),
    'expected #{this} to be truthy or have a length greater than zero',
    'expected #{this} to be falsey or have a length of zero'
  );
});

mocha.checkLeaks();
mocha.run();
