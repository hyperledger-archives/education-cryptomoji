import React from 'react';

import { createKeys, getPublicKey } from './services/signing';

export class SignupLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: null
    };

    this.handlePrivateKeyChange = this.handlePrivateKeyChange.bind(this);
    this.login = this.login.bind(this);
    this.generateNewPrivateKey = this.generateNewPrivateKey.bind(this);
  }

  // ensures that when <App />'s private key changes (eg, set to null),
  // those changes are received & rendered properly in this component
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      privateKey: nextProps.privateKey
    };
  }

  handlePrivateKeyChange(event) {
    this.setState({privateKey: event.target.value.trim()});
  }

  login(event) {
    event.preventDefault();
    const { privateKey } = this.state;

    try {
      this.getPublicKeyFromPrivateKey(privateKey);
      this.props.setPrivateKey(privateKey);
      this.props.history.push('/');
    } catch (err) {
      alert(
        'Log in failed!\n'
        + "Are you sure that's a valid private key?\n\n"
        + err
      );
    }
  }

  getPublicKeyFromPrivateKey(privateKey) {
    const publicKey = getPublicKey(privateKey);
    this.props.setPublicKey(publicKey);
  }

  generateNewPrivateKey() {
    const { privateKey, publicKey } = createKeys();
    this.props.setPublicKey(publicKey);
    this.props.setPrivateKey(privateKey);
    this.props.history.push('/');
  }

  render() {
    const isLoggedIn = !!this.props.privateKey;
    return (
      <div>
        {/* Sign Up Form */}
        <form onSubmit={this.login}>
          <label>
            Private Key: {' '}
            <input
              name="privateKey"
              value={this.state.privateKey || ''}
              onChange={this.handlePrivateKeyChange}
            />
          </label>
          {
            !isLoggedIn && <input type="submit" value="Login" />
          }
        </form>

        {/* Generate New Private Key Submit */}
        {
          !isLoggedIn &&
          (
            <input
              type="button"
              onClick={this.generateNewPrivateKey}
              value="Generate New Key">
            </input>
          )
        }
      </div>
    );
  }
}
