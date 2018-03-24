import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import { All } from './All';
import { One } from './One';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/all">All</Link>&nbsp;|&nbsp;
          <Link to="/one">One</Link>
        </nav>
        <div>
          Hello world! This will show up always.
          <Route path="/all" component={All} />
          <Route path="/one" component={One} />
        </div>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
