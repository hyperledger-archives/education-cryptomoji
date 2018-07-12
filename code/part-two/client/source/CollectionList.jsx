import React from 'react';
import { Link } from 'react-router-dom';

import { MojiItem } from './MojiItem';

import { getCollections } from './services/requests';

export class CollectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: null
    };
  }

  componentDidMount() {
    this.fetchcollections();
  }

  fetchcollections(publicKey) {
    return getCollections()
      .then(collections => this.setState({ collections }))
      .catch(err => {
        console.error('Fetch collections failed', err);
      });
  }

  render() {
    const { collections } = this.state;
    if (!collections) {
      return <div>No collections found anywhere!</div>;
    }
    return (
      <div>
        <h1>Collections!</h1>
        <ul>
          {collections.map(collection => (
            <li key={collection.key}>
              <Link to={'/collection/' + collection.key}>{collection.key}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
