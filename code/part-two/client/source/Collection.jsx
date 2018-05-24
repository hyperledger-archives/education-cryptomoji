import React from 'react';

import { MojiItem } from './MojiItem';
import { getCollections } from './services/requests';

export class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicKey: null,
      collection: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('GETDERIVEDSTATEFROMPROPS: <Collection />');
    const publicKey = nextProps.match.params.publicKey;
    return {
      publicKey
    };
  }

  componentDidMount() {
    console.log('COMPONENTDIDMOUNT: <Collection />');
    this.fetchCollection(this.state.publicKey);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('COMPONENTDIDUPDATE: <Collection />');
    if (this.state.publicKey !== prevState.publicKey) {
      this.fetchCollection(this.state.publicKey);
    }
  }

  fetchCollection(publicKey) {
    console.log('fetchCollection');
    return getCollections(publicKey)
      .then(collection => this.setState({ collection }))
      .catch(err => {
        console.error(`Fetch collection failed for ${publicKey}`, err);
        this.setState({ collection: null });
      });
  }

  render() {
    console.log('RENDERING: <Collection />');
    const { publicKey, collection } = this.state;
    if (!collection) {
      return (
        <div>
          We can't find a collection for public key <code>{publicKey}</code>!
        </div>
      );
    }
    return (
      <div>
        <h1>This is <code>{publicKey}</code>'s collection!</h1>
        {collection.moji.map(address => (
          <MojiItem
            key={address}
            address={address}
          />
        ))}
      </div>
    );
  }
}
