import React from 'react';

export class SignupLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
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
    console.log(this.state);
  }

  generateNewPrivateKey() {
    console.log('generating new private key');
    localStorage.setItem('pk', 'NEW PRIVATE KEY');
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
              value={this.state.privateKey}
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
