import React from 'react';

import { createKeys, getPublicKey } from './services/signing';

export class SignupLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: this.props.privateKey,
      publicKey: this.props.publicKey
    };

    this.handlePrivateKeyChange = this.handlePrivateKeyChange.bind(this);
    this.login = this.login.bind(this);
    this.generateNewPrivateKey = this.generateNewPrivateKey.bind(this);
  }

  handlePrivateKeyChange(event) {
    this.setState({privateKey: event.target.value});
  }

  login(event) {
    event.preventDefault();
    const { privateKey } = this.state;
    this.props.setPrivateKey(privateKey);

    this.getPublicKeyFromPrivateKey(privateKey);
    this.props.history.push('/');
  }

  getPublicKeyFromPrivateKey(privateKey) {
    const publicKey = getPublicKey(privateKey);

    console.log(publicKey);
    this.props.setPublicKey(publicKey);
  }

  generateNewPrivateKey() {
    const { privateKey, publicKey } = createKeys();
    this.props.setPublicKey(publicKey);
    this.props.setPrivateKey(privateKey);
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        {/* Sign Up Form */}
        <form onSubmit={this.login}>
          <label>
            Private Key
            <input
              name="privateKey"
              value={this.state.privateKey || ''}
              onChange={this.handlePrivateKeyChange}
            />
          </label>
          <input type="submit" value="Login" />
        </form>

        {/* Generate New Private Key Submit */}
        <input
          type="button"
          onClick={this.generateNewPrivateKey}
          value="Generate New Key">
        </input>
      </div>
    );
  }
}
