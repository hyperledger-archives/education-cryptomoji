/* SOLUTION FILE */
import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji, getSires } from './services/requests';
import { parseDna } from './services/parse_dna';

export class MojiListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSire: false,
      mojiView: null
    };
  }

  async componentDidMount() {
    let moji = this.props.moji || await getMoji(this.props.address);
    this.setState({ mojiView: parseDna(moji.dna).view });

    let address = moji.address;
    var isSire = moji.isSire || (await getSires(moji.owner)).address === address;
    this.setState({ isSire });
  }

  render() {
    let sireIndicator = null;
    if (this.state.isSire) {
      sireIndicator = <span className="badge badge-primary">🎩 sire</span>;
    }
    return (
      <div className="card">
        <div className="card-body">
          <Link
            to={'/moji/' + (this.props.address || this.props.moji.address)}
            className="card-title card-link"
          >
            {this.state.mojiView}
            {' '}
            {sireIndicator}
          </Link>
        </div>
      </div>
    );
  }
}
