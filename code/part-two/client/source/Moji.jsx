import React from 'react';
import { Link } from 'react-router-dom';

import { getMoji, getSires, submitPayloads } from './services/requests';
import { parseDna } from './services/parse_dna';

export class Moji extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      isLoaded: false,
      isOwner: false,
      isSire: false,
      moji: null,
      mojiView: null
    };
    this.selectSire = this.selectSire.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const address = nextProps.match.params.address;
    return {
      address,
      isLoaded: false,
      isOwner: false,
      isSire: false,
      moji: null,
      mojiView: null
    };
  }

  componentDidMount() {
    this.fetchMoji(this.state.address);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.address !== prevState.address) {
      this.fetchMoji(this.state.address);
    }
  }

  fetchMoji(address) {
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
        return getSires(moji.owner);
      })
      .then(sire => {
        const isSire = sire.address === this.state.address;
        if (isSire) {
          this.setState(prevState => ({
            mojiView: prevState.mojiView + ' 🎩'
          }));
        }
        this.setState({ isSire });
      })
      .catch(err => {
        console.error(`Fetch sire failed for ${this.state.moji.owner}`, err);
      })
      .finally(() => {
        this.setState({ isLoaded: true });
      });
  }

  selectSire() {
    return submitPayloads(this.props.privateKey, {
      action: 'SELECT_SIRE',
      sire: this.state.address
    })
      .then(() => this.setState(prevState => ({
        isSire: true,
        mojiView: prevState.mojiView + ' 🎩'
      })))
      .catch(err => {
        alert('Something went wrong while trying to select a new sire:' + err);
      });
  }

  render() {
    const { address, isLoaded, isOwner, isSire, moji, mojiView } = this.state;

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

    let actionButton = null;

    if (isOwner && !isSire) {
      actionButton = (
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={this.selectSire}
        >Select as Sire</button>
      );
    }

    return (
      <div>
        {actionButton}
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
