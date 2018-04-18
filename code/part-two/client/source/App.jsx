import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { Browse } from './Browse';
import { CreateOffer } from './CreateOffer';

import { api } from './utils/fakeApi';

export class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>&ensp;
          <Link to="/createOffer">Create Offer</Link>&ensp;
          <Link to="/browse/offers">View Offers</Link>&ensp;
          <Link to="/browse">Browse</Link>
        </nav>
        <Switch>
          <Route
            exact
            path="/createOffer"
            component={CreateOffer}
          />
          <Route
            path="/browse/:address?"
            component={Browse}
          />
        </Switch>
      </div>
    );
  }
}
