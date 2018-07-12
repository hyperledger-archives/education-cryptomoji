import React from 'react';
import { NavLink  } from 'react-router-dom';

export function NavBar({ publicKey, logout }) {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <span className="navbar-brand mb-0 h1">Cryptomoji</span>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="navbar-nav">
          {
            publicKey &&
            (
              <NavLink
                exact
                to={'/collection/' + publicKey}
                className="nav-item nav-link"
                activeClassName="active"
              >My Moji</NavLink>
            )
          }

          <NavLink
            exact
            to="/collection"
            className="nav-item nav-link"
            activeClassName="active"
          >Collections</NavLink>

          <NavLink
            exact
            to="/offer"
            className="nav-item nav-link"
            activeClassName="active"
          >Offers</NavLink>

          <NavLink
            exact
            to="/auth"
            className="nav-item nav-link"
            activeClassName="active"
          >
            {publicKey ? 'Private Key' : 'Sign Up/Login'}
          </NavLink>

          {
            publicKey &&
            (
              <a
                href="#"
                onClick={logout}
                className="nav-item nav-link"
              >Logout</a>
            )
          }
        </div>
      </div>
    </nav>
  );
}
