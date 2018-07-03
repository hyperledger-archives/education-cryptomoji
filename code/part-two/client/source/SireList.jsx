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
      .then(sires => this.setState({ sires }));
  }

  render() {
    // this.state.sires is an array of objects, not an array of addresses.
    // MojiList expects a list of addresses, so the following line emphasizes
    // code re-use over optimizing for a limited number of API calls.
    return <MojiList moji={this.state.sires.map(({address}) => address)} />;
  }
}
