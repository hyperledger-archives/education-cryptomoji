'use strict';

const { hash } = require('./helpers');


const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '1.0';
const NAMESPACE = hash(FAMILY_NAME, 6);

const BLOCK_INFO = '00bl0c';
const BLOCK_CONFIG_ADDRESS = BLOCK_INFO_NAMESPACE +
  Array.map.apply(null, Array(64)).map(() => '0').join('');
const BLOCK_INFO_NAMESPACE = BLOCK_INFO + '01';

module.exports = {
  FAMILY_NAME,
  FAMILY_VERSION,
  NAMESPACE,
  BLOCK_CONFIG_ADDRESS,
  BLOCK_INFO_NAMESPACE
};
