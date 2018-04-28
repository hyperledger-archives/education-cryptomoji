import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { Collection } from './Collection';
import { Moji } from './Moji';
import { Offer } from './Offer';
import { OfferList } from './OfferList';

export class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>&ensp;
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
