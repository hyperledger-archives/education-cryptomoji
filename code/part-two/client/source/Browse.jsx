import React from 'react';

import { Collection } from './Collection';
import { Moji } from './Moji';
import { Offer } from './Offer';
import { OfferList } from './OfferList';
import { Search } from './Search';

import { api } from './utils/fakeApi';
import { utils } from './utils/utils';

export class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      type: null,
      collection: null,
      moji: null,
      offer: null,
      offers: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('GETDERIVEDSTATEFROMPROPS: <Browse />');
    const address = nextProps.match.params.address;
    const type = utils.type(address);
    return {
      address,
      type
    };
  }

  componentDidMount() {
    console.log('COMPONENTDIDMOUNT: <Browse />');
    this.update();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('COMPONENTDIDUPDATE: <Browse />');
    if (this.state.address !== prevState.address) {
      this.update();
    }
  }

  update() {
    if (this.state.type === 'collection') {
      this.fetchCollection(this.state.address);
    } else if (this.state.type === 'moji') {
      this.fetchMoji(this.state.address);
    } else if (this.state.type === 'offer') {
      this.fetchOffer(this.state.address);
    } else if (this.state.type === 'offers') {
      this.fetchAllOffers();
    }
  }

  fetchCollection(address) {
    console.log('fetchCollection');
    return api.GET_COLLECTION(address, true)
      .then(collection => this.setState({ collection }))
      .catch(err => {
        console.error(`Fetch collection failed for ${address}`, err);
        this.setState({ collection: null });
      });
  }

  fetchMoji(address) {
    console.log('fetchMoji');
    return api.GET_CRYPTOMOJI(address)
      .then(moji => this.setState({ moji }))
      .catch(err => {
        console.error(`Fetch moji failed for ${address}`, err);
        this.setState({ moji: null });
      });
  }

  fetchOffer(address) {
    console.log('fetchOffer');
    return api.GET_OFFER(address)
      .then(offer => this.setState({ offer }))
      .catch(err => {
        console.error(`Fetch offer failed for ${address}`, err);
        this.setState({ offer: null });
      });
  }

  fetchAllOffers() {
    console.log('fetchAllOffers');
    return api.GET_ALL_OFFERS()
      .then(offers => this.setState({ offers }))
      .catch(err => {
        console.error('Fetch offers failed', err);
        this.setState({ offers: null });
      });
  }

  render() {
    const {address, type, collection, moji, offer, offers} = this.state;
    let child;
    if (type === 'collection') {
      child = <Collection address={address} collection={collection} />;
    } else if (type === 'moji') {
      child = <Moji address={address} moji={moji} />;
    } else if (type === 'offer') {
      child = <Offer address={address} offer={offer} />;
    } else if (type === 'offers') {
      child = <OfferList offers={offers} />;
    }
    return (
      <div>
        <Search {...this.props} />
        {child}
      </div>
    );
  }
}
