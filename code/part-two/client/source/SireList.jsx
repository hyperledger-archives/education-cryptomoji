/* SOLUTION FILE */
import React from 'react';

import { MojiList } from './MojiList';
import { getSires } from './services/requests';

export class SireList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sires: []
    };
  }

  componentDidMount() {
    getSires()
      .then(sires => {
        this.setState({
          sires: sires.map(sire =>{
            sire.isSire = true;
            return sire;
          })
        });
      });
  }

  render() {
    return <MojiList moji={this.state.sires} />;
  }
}
