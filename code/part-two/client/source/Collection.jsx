import React from 'react';

import { MojiItem } from './MojiItem';
import { getCollections, submitPayloads } from './services/requests';

export class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicKey: null,
      collection: null
    };
    this.createCollection = this.createCollection.bind(this);
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

  createCollection() {
    submitPayloads(this.props.privateKey, { action: 'CREATE_COLLECTION' })
      .then(() => {
        this.fetchCollection(this.state.publicKey);
      })
      .catch(err => {
        console.error(err);
        alert('Something went horribly wrong!');
      });
  }

  render() {
    console.log('RENDERING: <Collection />');
    const { publicKey, collection } = this.state;
    if (!collection) {
      return (
        <div>
          We can't find a collection for public key <code>{publicKey}</code>!
          <br /><br />
          { // if user is trying to view their non-existing collection
            this.props.publicKey === publicKey && (
              <span>
                If you are logged in as the owner of this collection and would
                like to create a new collection, please click {' '}
                <a href="#" onClick={this.createCollection}>here</a>!
              </span>
            )
          }
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
