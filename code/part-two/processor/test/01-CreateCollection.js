'use strict';

const { expect } = require('chai');

describe('Mocha/Chai', function() {
  it('should test equality', function() {
    expect(1).to.equal(1);
  });
  it('should test inequality', function() {
    expect(1).to.not.equal(2);
  });
});
