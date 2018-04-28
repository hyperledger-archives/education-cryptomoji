import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji } from './services/requests';

export class Moji extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      moji: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('GETDERIVEDSTATEFROMPROPS: <Moji />');
    const address = nextProps.match.params.address;
    return {
      address
    };
  }

  componentDidMount() {
    console.log('COMPONENTDIDMOUNT: <Moji />');
    this.fetchMoji(this.state.address);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('COMPONENTDIDUPDATE: <Moji />');
    if (this.state.address !== prevState.address) {
      this.fetchMoji(this.state.address);
    }
  }

  fetchMoji(address) {
    console.log('fetchMoji');
    return getMoji(address)
      .then(moji => this.setState({ moji }))
      .catch(err => {
        console.error(`Fetch moji failed for ${address}`, err);
        this.setState({ moji: null });
      });
  }

  render() {
    console.log('RENDERING: <Moji />');
    const { address, moji } = this.state;
    if (!moji) {
      return (
        <div>
          We can't find anything for a moji at <code>{address}</code>!
        </div>
      );
    }

    return (
      <div>
        <h2>Details for <code>{address}</code> moji!</h2>
        <table>
          <tbody>
            <tr><td>address</td><td>{moji.address}</td></tr>
            <tr><td>dna</td><td>{moji.dna}</td></tr>
            <tr>
              <td>owner</td>
              <td><Link to={'/collection/' + moji.owner}>{moji.owner}</Link></td>
            </tr>
            <tr>
              <td>sire</td>
              <td><Link to={'/moji/' + moji.sire}>{moji.sire}</Link></td>
            </tr>
            <tr>
              <td>breeder</td>
              <td><Link to={'/moji/' + moji.breeder}>{moji.breeder}</Link></td>
            </tr>
            <tr>
              <td>sired</td>
              <td>
                {moji.sired.map(address => (
                  <Link key={address} to={'/moji/' + address}>{address},</Link>
                ))}
              </td>
            </tr>
            <tr>
              <td>bred</td>
              <td>
                {moji.bred.map(address => (
                  <Link key={address} to={'/moji/' + address}>{address},</Link>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
