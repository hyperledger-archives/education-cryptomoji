import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { CreateOffer } from './CreateOffer';

export class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>&ensp;
          <Link to="/createOffer">Create Offer</Link>&ensp;
        </nav>
        <Switch>
          <Route
            exact
            path="/createOffer"
            component={CreateOffer}
          />
        </Switch>
      </div>
    );
  }
}
