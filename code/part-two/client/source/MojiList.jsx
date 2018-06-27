import React from 'react';

import { MojiListItem } from './MojiListItem';

export class MojiList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="card-columns">
        {this.props.moji.map(address => (
          <MojiListItem
            key={address}
            address={address}
          />
        ))}
      </div>
    );
  }
}