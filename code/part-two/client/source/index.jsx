import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import { Collection } from './Collection';
import { Search } from './Search';

import { api } from './utils/fakeApi';


class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/browse">Browse</Link>
        </nav>
        <Route path="/browse" component={Search} />
        <Route
          path="/browse/:collectionAddr/:mojiAddr?"
          component={Collection}
        />
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));
