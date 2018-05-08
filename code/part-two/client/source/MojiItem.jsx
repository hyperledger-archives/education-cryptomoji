import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji } from './services/requests';
import { parseDna } from './services/parseDna';

export class MojiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mojiView: null
    };
  }

  componentDidMount() {
    getMoji(this.props.address)
      .then(moji => {
        this.setState({
          mojiView: parseDna(moji.dna).view
        });
      });
  }

  render() {
    return (
      <div>
        <Link to={'/moji/' + this.props.address}>
          {this.state.mojiView || this.props.address}
        </Link>
      </div>
    );
  }
}
