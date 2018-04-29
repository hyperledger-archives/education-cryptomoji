import './01-Signing.js';
import './02-Encoding.js';


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

mocha.checkLeaks();
mocha.run();
