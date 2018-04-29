import * as encoding from '../source/services/encoding.js';


describe('Encoding module', function() {

  describe('encode', function() {
    const toEncode = { hello: 'world', foo: 'bar' };
    let encoded = null;

    beforeEach(function() {
      encoded = encoding.encode(toEncode);
    });

    it('should return a Buffer or an Uint8Array', function() {
      expect(encoded).to.be.bytes;
    });

    it('should return a Buffer, parseable as a JSON string', function() {
      const stringified = encoded.toString();
      expect(() => JSON.parse(stringified)).to.not.throw();
    });

    it('should return a sorted JSON string', function() {
      const stringified = encoded.toString();
      const helloIndex = stringified.indexOf('hello');
      const fooIndex = stringified.indexOf('foo');

      expect(helloIndex).to.not.equal(-1);
      expect(fooIndex).to.not.equal(-1);
      expect(fooIndex).to.be.lessThan(helloIndex);
    });

    it('should be parseable to the original object', function() {
      const decoded = JSON.parse(encoded.toString());
      expect(decoded).to.deep.equal(toEncode);
    });

  });

  describe('decode', function() {
    const toEncode = { hello: 'world', foo: 'bar' };
    let decoded = null;

    beforeEach(function() {
      const encoded = encoding.encode(toEncode).toString('base64');
      decoded = encoding.decode(encoded);
    });

    it('should take a base64 encoded Buffer and return an object', function() {
      expect(decoded).to.be.an('object');
    });

    it('should return an object that matches the encoded object', function() {
      expect(decoded).to.deep.equal(toEncode);
    });

  });

});
