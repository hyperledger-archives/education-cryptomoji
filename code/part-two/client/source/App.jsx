import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NavBar } from './NavBar';
import { Auth } from './Auth';

import { Collection } from './Collection';
import { CollectionList } from './CollectionList';
import { Moji } from './Moji';
import { Offer } from './Offer';
import { OfferList } from './OfferList';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: localStorage.getItem('privateKey') || null,
      publicKey: localStorage.getItem('publicKey') || null
    };
    this.logout = this.logout.bind(this);
  }

  set privateKey(key) {
    this.setState({ privateKey: key });
    localStorage.setItem('privateKey', key);
  }

  get privateKey() {
    return this.state.privateKey
      ? this.state.privateKey
      : localStorage.getItem('privateKey');
  }

  set publicKey(key) {
    this.setState({ publicKey: key });
    localStorage.setItem('publicKey', key);
  }

  get publicKey() {
    return this.state.publicKey
      ? this.state.publicKey
      : localStorage.getItem('publicKey');
  }

  logout() {
    const proceed = confirm(
      'Are you sure you want to log out?\n'
      + "You won't be able to log back in without your private key!"
    );
    if (proceed) {
      this.privateKey = null;
      this.publicKey = null;
      localStorage.removeItem('privateKey');
      localStorage.removeItem('publicKey');
    }
  }

  render() {
    const publicKey = this.publicKey;
    return (
      <div className="container">
        <NavBar publicKey={publicKey} logout={this.logout} />
        {publicKey && <div>Public Key: <code>{publicKey}</code></div>}
        <br /><br />
        <Switch>
          <Route
            exact
            path="/auth"
            render={props => (
              <Auth
                {...props}
                privateKey={this.privateKey}
                setPrivateKey={(key) => this.privateKey = key}
                setPublicKey={(key) => this.publicKey = key}
              />
            )}
          />
          <Route
            exact
            path="/collection/"
            component={CollectionList}
          />
          <Route
            exact
            path="/collection/:publicKey"
            component={Collection}
          />
          <Route
            exact
            path="/moji/:address"
            render={props => (
              <Moji
                {...props}
                publicKey={this.publicKey}
                privateKey={this.privateKey}
              />
            )}
          />
          <Route
            exact
            path="/offer"
            component={OfferList}
          />
          <Route
            exact
            path="/offer/:address"
            component={Offer}
          />
        </Switch>
      </div>
    );
  }
}
