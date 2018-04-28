import React from 'react';
import { Link } from 'react-router-dom';

import { MojiItem } from './MojiItem';

export function ResponseList({ offer }) {
  console.log('RENDERING: <ResponseList />');
  let list;
  if (offer.responses.length) {
    list = offer.responses.map(response => {
      let message;
      if (response.approver !== offer.owner) {
        message = 'The creator of the offer is requesting the following moji in return:';
      } else {
        message = 'The following mojis are being responded in return:';
      }
      return (
        <div>
          {message}
          <ul>
            {response.moji.map(moji => (
              <li key={moji}>
                <MojiItem address={moji} />
              </li>
            ))}
          </ul>
        </div>
      );
    });
  } else {
    list = <div>No responses yet!!</div>;
  }
  return (
    <div>
      <h2>Responses:</h2>
      {list}
    </div>
  );
}
