import { utils } from './utils';
import { blockchain } from './fakeData';

export const api = {};

api.GET_CRYPTOMOJI = (address = '', detailed) => {
  let moji;
  if (address.split('_')[0] === 'moji') {
    moji = utils.copy(blockchain[address]);
    if (moji && detailed) {
      moji.collection = api.GET_COLLECTION(moji.collection, true);
    }
  }
  return utils.delay(moji, 1000, 'Failed GET_CRYPTOMOJI!');
};

api.GET_BLOCK_INFO = (address = '') => {
  let block;
  if (address.split('_')[0] === 'block') {
    block = utils.copy(blockchain[address]);
  }
  return utils.delay(block, 1000, 'Failed GET_BLOCK_INFO!');
};

api.GET_COLLECTION = (address = '', detailed) => {
  let collection;
  if (address.split('_')[0] === 'collection') {
    collection = utils.copy(blockchain[address]);
    if (collection && detailed) {
      collection.moji = collection.moji.map(address => {
        return Object.assign(utils.copy(blockchain[address]), {address});
      });
    }
  }
  return utils.delay(collection, 1000, 'Failed GET_COLLECTION!');
};
