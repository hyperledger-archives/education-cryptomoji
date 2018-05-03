import React from 'react';
import { Link } from 'react-router-dom';

import { ResponseList } from './ResponseList';

export class Offer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {address, offer} = this.props;
    if (!address || !offer) {
      return <div>No offer found!</div>;
    }
    return (
      <div>
        <h1>This is the <code>{address}</code> offer!</h1>
        <div>The following moji are being offered from the <Link to={'/browse/' + offer.owner}>{offer.owner}</Link> collection:</div>
        <ul>
          {offer.moji.map(moji => (
            <li key={moji}><Link to={'/browse/' + moji}>{moji}</Link></li>
          ))}
        </ul>
        <ResponseList offer={offer} />
      </div>
    );
  }
}
