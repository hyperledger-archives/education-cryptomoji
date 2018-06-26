/* SOLUTION FILE */
import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji } from './services/requests';
import { parseDna } from './services/parse_dna';

export class Moji extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      isLoaded: false,
      isOwner: false,
      moji: null,
      mojiView: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('GETDERIVEDSTATEFROMPROPS: <Moji />');
    const address = nextProps.match.params.address;
    return {
      address,
      isLoaded: false,
      isOwner: false,
      moji: null,
      mojiView: null
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
      .catch(err => {
        console.error(`Fetch moji failed for ${address}`, err);
      })
      .then(moji => {
        this.setState({
          isOwner: moji.owner === this.props.publicKey,
          moji,
          mojiView: parseDna(moji.dna).view
        });
      })
      .finally(() => {
        this.setState({ isLoaded: true });
      });
  }

  render() {
    console.log('RENDERING: <Moji />');
    const { address, isLoaded, isOwner, moji, mojiView } = this.state;

    if (!isLoaded) {
      return <div></div>;
    }

    if (isLoaded && !moji) {
      return (
        <div>
          We can't find anything for a moji at <code>{address}</code>!
        </div>
      );
    }

    return (
      <div>
        <h2>{mojiView}</h2>
        <table>
          <tbody>
            <tr><td>address</td><td>{moji.address}</td></tr>
            <tr><td>dna</td><td>{moji.dna}</td></tr>
            <tr>
              <td>owner</td>
              <td>
                <Link to={'/collection/' + moji.owner}>
                  {isOwner ? 'you!' : moji.owner}
                </Link>
              </td>
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
