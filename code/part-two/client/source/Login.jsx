import React from 'react';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email
          <input
            name="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <input type="submit" value="sign up" />
      </form>
    );
  }
}
