import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { SignupLogin } from './SignupLogin';

import { Collection } from './Collection';
import { CollectionList } from './CollectionList';
import { Moji } from './Moji';
import { Offer } from './Offer';
import { OfferList } from './OfferList';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      privateKey: this.props.privateKey
    }
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

  logout() {
    this.privateKey = null;
    localStorage.removeItem('privateKey');
  }
  
  render() {
    const privateKey = this.privateKey
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>&ensp;
          <Link to="/signup-login">Sign Up/Login</Link>&ensp;
          <Link to="/collection">View Collections</Link>&ensp;
          <Link to="/offer">View Offers</Link>&ensp;

          {/* public key view / logout */}
          { privateKey &&
            <div>
              { privateKey }
              <a href="#" onClick={() => this.logout()}>logout</a>
            </div>
          }
        </nav>
        <Switch>
          <Route
            exact
            path="/signup-login"
            render={(props) => { 
              return (
                <SignupLogin 
                  {...props}
                  privateKey={this.privateKey} 
                  setPrivateKey={(key) => this.privateKey = key}
                />
              )
            }}
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
            component={Moji}
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
