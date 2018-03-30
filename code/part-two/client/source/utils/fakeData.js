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
  // cryptoemoji
  'moji_cat1': {
    dna: 'moji_cat1: dna dna dna dna dna',
    generation: 0,
    collection: 'collection_cats1',
    sire: 'moji_cat1sire',
    breeder: 'moji_cat1breeder',
    sired: ['moji_cat1sired1', 'moji_cat1sired2'],
    bred: ['moji_cat1bred1', 'moji_cat1bred2'],
    lastSired: 220,
    lastBred: 221
  },
  'moji_cat2': {
    dna: 'moji_cat2: dna dna dna dna dna',
    generation: 0,
    collection: 'collection_cats1',
    sire: 'moji_cat2sire',
    breeder: 'moji_cat2breeder',
    sired: ['moji_cat2sired1', 'moji_cat2sired2'],
    bred: ['moji_cat2bred1', 'moji_cat2bred2'],
    lastSired: 220,
    lastBred: 221
  },
  'moji_cat3': {
    dna: 'moji_cat3: dna dna dna dna dna',
    generation: 0,
    collection: 'collection_cats1',
    sire: 'moji_cat3sire',
    breeder: 'moji_cat3breeder',
    sired: ['moji_cat3sired1', 'moji_cat3sired2'],
    bred: ['moji_cat3bred1', 'moji_cat3bred2'],
    lastSired: 330,
    lastBred: 331
  },
  // offer
  // sire listing
  // block info
};
