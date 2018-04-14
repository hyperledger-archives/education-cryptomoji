import React from 'react';

import { api } from './utils/fakeApi';

export class CreateOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ addresses: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.createOffer(this.state.addresses);
  }

  createOffer(addresses) {
    addresses = addresses.trim().split('\n');
    return api.CREATE_OFFER(addresses, 'owner')
      .then(offer => {
        console.log('new offer made at', offer);
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <h1>Create Offer!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter the moji addresses for which you'd like to create an offer,
            each on a new line:<br />
            <textarea
              name="addresses"
              value={this.state.addresses}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="search" />
        </form>
      </div>
    );
  }
}
