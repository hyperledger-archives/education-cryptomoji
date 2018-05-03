import { utils } from './utils';
import { blockchain } from './fakeData';

const CREATE_OFFER = (addresses, owner) => {
  const ownerOwnsMoji = true;
  let offer;
  if (1 < addresses.length && addresses.every(moji => ownerOwnsMoji)) {
    offer = 'offer_' + addresses.join('_');
  }
  return utils.delay(offer, 1000, 'Failed CREATE_COLLECTION!');
};

const GET_BLOCK_INFO = (address = '') => {
  let block;
  if (address.split('_')[0] === 'block') {
    block = utils.copy(blockchain[address]);
  }
  return utils.delay(block, 1000, 'Failed GET_BLOCK_INFO!');
};

const GET_COLLECTION = (address = '', detailed) => {
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

const GET_CRYPTOMOJI = (address = '', detailed) => {
  let moji;
  if (address.split('_')[0] === 'moji') {
    moji = utils.copy(blockchain[address]);
    if (moji && detailed) {
      moji.owner = GET_COLLECTION(moji.owner, true);
    }
  }
  return utils.delay(moji, 1000, 'Failed GET_CRYPTOMOJI!');
};

const GET_OFFER = (address = '') => {
  let offer;
  if (address.split('_')[0] === 'offer') {
    offer = utils.copy(blockchain[address]);
    if (offer) {
      offer.address = address;
    }
  }
  return utils.delay(offer, 1000, 'Failed GET_OFFER');
};

const GET_ALL_OFFERS = () => {
  let offerAddresses = Object.keys(blockchain).filter(key => {
    return key.split('_')[0] === 'offer';
  });
  return Promise.all(offerAddresses.map(addr => GET_OFFER(addr)));
};

export const api = {
  CREATE_OFFER,
  GET_BLOCK_INFO,
  GET_COLLECTION,
  GET_CRYPTOMOJI,
  GET_OFFER,
  GET_ALL_OFFERS
};
