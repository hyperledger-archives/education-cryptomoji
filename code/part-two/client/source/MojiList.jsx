import React from 'react';

import { MojiListItem } from './MojiListItem';

export class MojiList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="list-group">
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