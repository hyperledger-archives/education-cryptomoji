import React from 'react';

export class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      passwordsMatch: false
    };
    
    this.setContext();
  }

  setContext() {
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
      passwordsMatch: this.confirmPassword(
        event.target.value,
        this.state.confirmPassword
      )
    });
  }

  handleConfirmPasswordChange(event) {
    this.setState({
      confirmPassword: event.target.value,
      passwordsMatch: this.confirmPassword(
        this.state.password,
        event.target.value
      )
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

  confirmPassword(password, confirmedPassword) {
    return password === confirmedPassword;
  }

  render() {
    const passwordsMatch = this.state.passwordsMatch;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email
          <input
            name="email"
            minLength="8"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength="8"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <label>
          Confirm Password
          <input
            name="confirmPassword"
            type="password"
            value={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordChange}
          />
        </label>
        <input type="submit" value="sign up" />
        <p>Passwords {
          !passwordsMatch ? 'do not' : ''
        } match</p>
      </form>
    );
  }
}
