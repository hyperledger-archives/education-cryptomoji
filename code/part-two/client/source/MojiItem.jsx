/* SOLUTION FILE */
import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji } from './services/requests';
import { parseDna } from './services/parse_dna';

export class MojiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      mojiView: null
    };
  }

  componentDidMount() {
    getMoji(this.props.address)
      .then(moji => {
        this.setState({
          isLoaded: true,
          mojiView: parseDna(moji.dna).view
        });
      });
  }

  render() {
    return (
      <div>
        <Link to={'/moji/' + this.props.address}>
          {this.state.isLoaded && (this.state.mojiView || this.props.address)}
        </Link>
      </div>
    );
  }
}
