/* SOLUTION FILE */
import React from 'react';
import { Link } from 'react-router-dom';

import { BreedDropdownMenu } from './BreedDropdownMenu';
import { MojiList } from './MojiList';
import { MojiListItem } from './MojiListItem';
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
      .then(() => this.setState({
        isSire: true,
      }))
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
    let sireIndicator = null;

    if (isSire) {
      sireIndicator = <span className="badge badge-primary">🎩 sire</span>;
    }

    if (isOwner && !isSire) {
      actionButton = (
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={this.selectSire}
        >Select as Sire</button>
      );
    } else if (isSire && this.props.publicKey) {
      // if we're looking at a sire AND we're logged in
      actionButton = (
        <BreedDropdownMenu
          privateKey={this.props.privateKey}
          publicKey={this.props.publicKey}
          sire={moji}
        />
      );
    }

    return (
      <div>
        {actionButton}
        <h2>{mojiView} {' '} {sireIndicator}</h2>
        <table className="table">
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
              <td>{moji.sire
                ? <MojiListItem address={moji.sire}/>
                : 'none'
              }</td>
            </tr>
            <tr>
              <td>breeder</td>
              <td>{moji.breeder
                ? <MojiListItem address={moji.breeder} />
                : 'none'
              }</td>
            </tr>
            <tr>
              <td>sired</td>
              <td>{moji.sired.length
                ? <MojiList addresses={moji.sired} />
                : 'none'
              }</td>
            </tr>
            <tr>
              <td>bred</td>
              <td>{moji.bred.length
                ? <MojiList addresses={moji.bred} />
                : 'none'
              }</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
