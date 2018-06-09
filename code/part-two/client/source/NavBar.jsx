/* SOLUTION FILE */
import React from 'react';
import { Link } from 'react-router-dom';

export function NavBar({ publicKey, logout }) {
  return (
    <nav>
      <Link to="/">Home</Link>&ensp;
      {
        publicKey &&
        (
          <Link to={'/collection/' + publicKey}>
            Your Collection
          </Link>
        )
      }

      <Link to="/collection">View Collections</Link>&ensp;
      <Link to="/offer">View Offers</Link>&ensp;

      <Link to="/signup-login">
        {publicKey ? 'View Private Key' : 'Sign Up/Login'}
      </Link>&ensp;
      {publicKey && <a href="#" onClick={logout}>Logout</a>}
    </nav>
  );
}
