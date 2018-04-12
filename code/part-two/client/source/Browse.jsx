import React from 'react';

import { Collection } from './Collection';
import { Moji } from './Moji';
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
      moji: null
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

  render() {
    const {address, type, collection, moji} = this.state;
    let child;
    if (type === 'collection') {
      child = <Collection address={address} collection={collection} />;
    } else if(type === 'moji') {
      child = <Moji address={address} moji={moji} />;
    }
    return (
      <div>
        <Search {...this.props} />
        {child}
      </div>
    );
  }
}
