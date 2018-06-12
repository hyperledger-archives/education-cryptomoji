import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// START SOLUTION
import { App } from './App';
// END SOLUTION

/* START PROBLEM
ReactDOM.render((
  <BrowserRouter>
    <h1>Hello, Cryptomoji!</h1>
  </BrowserRouter>
), document.getElementById('app'));
END PROBLEM */

// START SOLUTION
ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));
// END SOLUTION
