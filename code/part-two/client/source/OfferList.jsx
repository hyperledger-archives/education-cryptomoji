import React from 'react';
import { Link } from 'react-router-dom';

import { MojiItem } from './MojiItem';

import { getOffers } from './services/requests';

export class OfferList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: null
    };
  }

  componentDidMount() {
    this.fetchOffers();
  }

  fetchOffers(publicKey) {
    return getOffers()
      .then(offers => this.setState({ offers }))
      .catch(err => {
        console.error('Fetch offers failed', err);
      });
  }

  render() {
    const { offers } = this.state;
    if (!offers) {
      return <div>No offers found anywhere!</div>;
    }
    return (
      <div>
        <h1>Offers!</h1>
        {offers.map(offer => (
          <div key={offer.address}>
            {offer.owner} is offering the following moji and has
            <Link to={'/offer/' + offer.address}>{offer.responses.length}
              responses</Link>
            {offer.moji.map(moji => <MojiItem key={moji} address={moji} />)}
          </div>
        ))}
      </div>
    );
  }
}
