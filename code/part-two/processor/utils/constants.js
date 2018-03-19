'use strict';

const { hash } = require('./helpers');


const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';

module.exports = {
  FAMILY_NAME: FAMILY_NAME,
  FAMILY_VERSION: FAMILY_VERSION,
  NAMESPACE: hash(FAMILY_NAME, 6)
};
