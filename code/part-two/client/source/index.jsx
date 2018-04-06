import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import { Browse } from './Browse';

import { api } from './utils/fakeApi';

class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/browse">Browse</Link>
        </nav>
        <Route
          path="/browse/:address?"
          component={Browse}
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
