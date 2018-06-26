/* SOLUTION FILE */
import React from 'react';

import {
  getCollections,
  getMoji,
  getSires,
  submitPayloads
} from './services/requests';
import { parseDna } from './services/parse_dna';

export class BreedDropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCollection: { moji: [] }
    };
    this.breed = this.breed.bind(this);
    this.fetchUserCollection = this.fetchUserCollection.bind(this);
  }

  componentDidMount() {
    this.fetchUserCollection();
  }

  breed(breeder) {
    return submitPayloads(this.props.privateKey, {
      action: 'BREED_MOJI',
      sire: this.props.sire.address,
      breeder: breeder.address
    }).then(this.fetchUserCollection);
  }

  fetchUserCollection() {
    return getCollections(this.props.publicKey)
      .then(userCollection => {
        this.setState({ userCollection });
        return Promise.all([
          getSires(this.props.publicKey),
          ...userCollection.moji.map(getMoji)
        ]);
      }).then(([sire, ...mojiList]) => {
        this.setState({
          userCollection: {
            moji: mojiList.map(moji => {
              if (sire.address === moji.address) {
                moji.isSire = true;
              }
              moji.mojiView = parseDna(moji.dna).view;
              return moji;
            })
          }
        });
      });
  }

  render () {
    return (
      <div className="dropdown">
        <button
          type="button"
          className="btn btn-primary dropdown-toggle float-right"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >Breed!</button>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="dropdownMenuButton"
        >
          {this.state.userCollection.moji.map(moji => {
            let disabled = '';
            let hat = '';
            let clickHandler = this.breed.bind(null, moji);
            if (moji.isSire) {
              disabled = ' disabled';
              hat = ' 🎩';
              clickHandler = () => {
                alert("Sorry, you can't breed two sires together!");
              };
            }
            return (
              <button
                className={'dropdown-item' + disabled}
                type="button"
                onClick={clickHandler}
                key={moji.address || moji}
              >{moji.mojiView + hat}</button>
            );
          })}
        </div>
      </div>
    );
  }
}
