import React from 'react';
import { Link } from 'react-router-dom';

import { ResponseListItem } from './ResponseListItem';

export function ResponseList({ offer }) {
  console.log('RENDERING: <ResponseList />');
  let list;
  if (offer.responses.length) {
    list = offer.responses.map(response => {
      if (response.isRequest) {
        return (
          <div>
            <Link to={'/browse/' + offer.owner}>{offer.owner}</Link> is willing
            to trade for
            <Link to={'/browse/' + response.owner}>{response.owner}</Link>'s
            following moji in return!:
            <ul>
              {response.moji.map(moji => <ResponseListItem moji={moji} />)}
            </ul>
          </div>
        );
      }
      return (
        <div>
          <Link to={'/browse/' + response.owner}>{response.owner}</Link> is
          responding with their following moji in return!:
          <ul>
            {response.moji.map(moji => <ResponseListItem moji={moji} />)}
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
