/* SOLUTION FILE */
import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji, getSires } from './services/requests';
import { parseDna } from './services/parse_dna';

export class MojiListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isSire: false,
      mojiView: null
    };
  }

  componentDidMount() {
    Promise.resolve(this.props.address)
      .then(address => {
        // if it's an address, then get the details
        if (!!address) {
          return getMoji(this.props.address);
        }
        // otherwise, the details were already passed in
        return this.props.moji;
      })
      .then(moji => {
        this.setState({
          mojiView: parseDna(moji.dna).view
        });

        if (moji.isSire) {
          this.setState({ isSire: true, isLoaded: true });
          // if we know moji is a sire, break out of the promise chain
          return Promise.reject('This moji is a sire');
        } else {
          return getSires(moji.owner);
        }
      })
      .then(sire => {
        const isSire =
          sire.address === (this.props.address || this.props.moji.address);
        this.setState({ isSire, isLoaded: true });
      })
      .catch(err => {
        if (err === 'This moji is a sire') {
          // don't do anything bc it's not an actual error
        } else {
          console.error(err);
        }
      });
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
            {this.state.isLoaded
              && (this.state.mojiView || this.props.address)
            }
            {' '}
            {sireIndicator}
          </Link>
        </div>
      </div>
    );
  }
}
