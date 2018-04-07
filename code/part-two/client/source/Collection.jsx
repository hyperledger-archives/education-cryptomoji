import React from 'react';

import { CollectionItem } from './CollectionItem';
import { MojiDetails } from './MojiDetails';

import { api } from './utils/fakeApi';

export class Collection extends React.Component {
  componentDidMount() {
    this.fetchCollection(this.props.match.params.collectionAddr);
  }

  componentWillReceiveProps(nextProps, prevState) {
    const address = nextProps.match.params.collectionAddr;
    if (address !== prevState.address) {
      this.fetchCollection(address);
    }
  }

  fetchCollection(address) {
    return api.GET_COLLECTION(address, true)
      .then(collection => {
        const mojiAddr = this.props.match.params.mojiAddr;
        this.setState({
          address,
          collection,
          selected: mojiAddr
            ? collection.moji.find(moji => {
              return moji.address === mojiAddr;
            })
            : null
        });
      })
      .catch(err => {
        console.error(`Fetch collection failed for ${address}`, err);
        this.setState({ address, collection: null, selected: null });
      });
  }

  render() {
    console.log('RENDERING: <Collection />');
    if (!this.state) {
      return <div>Loading...</div>;
    }

    const { address, collection, selected } = this.state;
    if (!collection) {
      return (
        <div>
          We can't find info for <code>{address}</code> collection!
        </div>
      );
    }

    return (
      <div>
        <h1>This is the <code>{address}</code> collection!</h1>
        {collection.moji.map(moji => (
          <CollectionItem
            key={moji.address}
            {...moji}
            {...this.props}
          />
        ))}
        <br />
        {selected && <MojiDetails moji={selected} />}
      </div>
    );
  }
}
