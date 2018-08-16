/* SOLUTION FILE */
import React from 'react';

import { MojiListItem } from './MojiListItem';

export class MojiList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.addresses) {
      return (
        <div className="card-columns">
          {this.props.addresses.map(address => (
            <MojiListItem
              key={address}
              address={address}
            />
          ))}
        </div>
      );
    } else if (this.props.moji) {
      return (
        <div className="card-columns">
          {this.props.moji.map(moji => (
            <MojiListItem
              key={moji.address}
              moji={moji}
            />
          ))}
        </div>
      );
    } else {
      return <div>Oops, there was a mistake rendering the moji!</div>;
    }
  }
}