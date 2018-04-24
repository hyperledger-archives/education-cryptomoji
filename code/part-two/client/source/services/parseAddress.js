'use strict';

import { FAMILY_NAME, NAMESPACE, TYPE_PREFIXES } from '../utils/constants';

export const addressToType = (address = '') => {
  if (address.slice(0, 6) === NAMESPACE) {
    const resource = address.slice(6, 8);
    if (resource === TYPE_PREFIXES.COLLECTION) {
      return 'collection';
    } else if (resource === TYPE_PREFIXES.MOJI) {
      return 'moji';
    } else if (resource === TYPE_PREFIXES.OFFER) {
      return 'offer';
    } else if (resource === TYPE_PREFIXES.SIRE_LISTING) {
      return 'sire';
    }
  }
  return null;
};
