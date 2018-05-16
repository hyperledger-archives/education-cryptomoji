import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// START SOLUTION
import { App } from './App';
// END SOLUTION

ReactDOM.render((
  <BrowserRouter>
    /* START PROBLEM
    <h1>Hello, Cryptomoji!</h1>
    END PROBLEM */
    // START SOLUTION
    <App />
    // END SOLUTION
  </BrowserRouter>
), document.getElementById('app'));
