import React from 'react';
import { Link } from 'react-router-dom';

import { MojiItem } from './MojiItem';
import { ResponseList } from './ResponseList';

import { getOffers } from './services/requests';

export class Offer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      offer: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const address = nextProps.match.params.address;
    return {
      address
    };
  }

  componentDidMount() {
    this.fetchOffer(this.state.address);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.address !== prevState.address) {
      this.fetchOffer(this.state.address);
    }
  }

  fetchOffer(address) {
    return getOffers(address)
      .then(offer => this.setState({ offer }))
      .catch(err => {
        console.error(`Fetch offer failed for ${address}`, err);
        this.setState({ offer: null });
      });
  }

  render() {
    const {address, offer} = this.state;
    if (!address || !offer) {
      return <div>No offer found!</div>;
    }
    return (
      <div>
        <h1>This is the <code>{address}</code> offer!</h1>
        <div>The following moji are being offered from the <Link to={'/collection/' + offer.owner}>{offer.owner}</Link> collection:</div>
        <ul>
          {offer.moji.map(moji => (
            <li key={moji}>
              <MojiItem address={moji} />
            </li>
          ))}
        </ul>
        <ResponseList offer={offer} />
      </div>
    );
  }
}
