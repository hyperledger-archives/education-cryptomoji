import React from 'react';
import { Link } from 'react-router-dom';

export function OfferList({ offers }) {
  console.log('RENDERING: <OfferList />');
  if (!offers) {
    return <div>No offers found anywhere!</div>;
  }
  return (
    <div>
      <h1>Offers!</h1>
      {offers.map(offer => (
        <div key={offer.address}>
          {offer.owner} is offering the following moji and has
          <Link to={'/browse/' + offer.address}>{offer.responses.length}
          responses</Link>
          <ul>
            {offer.moji.map(moji => <li key={moji}>{moji}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
