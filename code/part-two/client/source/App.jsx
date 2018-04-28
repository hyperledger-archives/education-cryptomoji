import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { Collection } from './Collection';
import { CreateOffer } from './CreateOffer';
import { Moji } from './Moji';
import { OfferList } from './OfferList';

export class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>&ensp;
          <Link to="/createOffer">Create Offer</Link>&ensp;
          <Link to="/offer">View Offers</Link>&ensp;
        </nav>
        <Switch>
          <Route
            exact
            path="/collection/:publicKey"
            component={Collection}
          />
          <Route
            exact
            path="/createOffer"
            component={CreateOffer}
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
        </Switch>
      </div>
    );
  }
}
