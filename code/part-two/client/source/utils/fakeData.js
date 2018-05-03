// const PUBLIC_KEY =
//   '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa';
// const NAMESPACE = '5f4d76';
// const PREFIX = {
//   blockInfo: '00',
//   collection: '01',
//   collectionResource: {
//     toString: () => '02',
//     cryptomoji: '00',
//     offer: '01'
//   },
//   sireListing: '03'
// };

export const blockchain = {
  // collection
  'collection_cats1': {
    key: 'pubkey_owner1', // public key
    moji: ['moji_cat1', 'moji_cat2', 'moji_cat3'] // string addresses
  },
  'collection_cats2': {
    key: 'pubkey_owner2',
    moji: ['moji_cat4', 'moji_cat5', 'moji_cat6', 'moji_cat7']
  },
  // cryptoemoji
  'moji_cat1': {
    dna: 'moji_cat1: dna dna dna dna dna',
    generation: 0,
    collection: 'collection_cats1',
    sire: null, // moji was generated on collection creation
    breeder: null, // moji was generated on collection creation
    sired: [],
    bred: [],
  },
  'moji_cat2': {
    dna: 'moji_cat2: dna dna dna dna dna',
    generation: 0,
    collection: 'collection_cats1',
    sire: null, // moji was generated on collection creation
    breeder: null, // moji was generated on collection creation
    sired: [],
    bred: [],
  },
  'moji_cat3': {
    dna: 'moji_cat3: dna dna dna dna dna',
    generation: 0,
    collection: 'collection_cats1',
    sire: null, // moji was generated on collection creation
    breeder: null, // moji was generated on collection creation
    sired: [],
    bred: [],
  },
  'moji_cat4': {
    dna: 'moji_cat4: dna dna dna dna dna',
    collection: 'collection_cats2',
    sire: null, // moji was generated on collection creation
    breeder: null, // moji was generated on collection creation
    sired: ['moji_cat7'],
    bred: [],
  },
  'moji_cat5': {
    dna: 'moji_cat5: dna dna dna dna dna',
    collection: 'collection_cats2',
    sire: null, // moji was generated on collection creation
    breeder: null, // moji was generated on collection creation
    sired: [],
    bred: ['moji_cat7']
  },
  'moji_cat6': {
    dna: 'moji_cat6: dna dna dna dna dna',
    collection: 'collection_cats2',
    sire: null, // moji was generated on collection creation
    breeder: null, // moji was generated on collection creation
    sired: [],
    bred: []
  },
  'moji_cat7': {
    dna: 'moji_cat7: dna dna dna dna dna',
    collection: 'collection_cats2',
    sire: 'moji_cat4',
    breeder: 'moji_cat5',
    sired: [],
    bred: []
  },
  // offer
  'offer_owner1a': {
    owner: 'collection_cats1',
    moji: ['moji_cat1'],
    responses: []
  },
  'offer_owner1b': {
    owner: 'collection_cats1',
    moji: ['moji_cat2'],
    responses: []
  },
  'offer_owner2a': {
    owner: 'collection_cats2',
    moji: ['moji_cat7'],
    responses: [{
      owner: 'collection_cats1',
      moji: ['moji_cat1', 'moji_cat2'],
      isRequest: true // owner of collection_cats2 made this response
    }, {
      owner: 'collection_cats1',
      moji: ['moji_cat1'],
      isRequest: false
    }]
  },
  // sire listing
  // block info
};
