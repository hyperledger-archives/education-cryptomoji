import React from 'react';

import { CollectionItem } from './CollectionItem';

export function Collection ({address, collection}) {
  console.log('RENDERING: <Collection />');
  if (!collection) {
    return (
      <div>
        We can't find anything for a collection at <code>{address}</code>!
      </div>
    );
  }
  return (
    <div>
      <h1>This is the <code>{address}</code> collection!</h1>
      {collection.moji.map(moji => (
        <CollectionItem
          key={moji.address}
          {...moji}
        />
      ))}
    </div>
  );
}
