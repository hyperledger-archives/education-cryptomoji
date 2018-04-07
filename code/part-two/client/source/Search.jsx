import React from 'react';

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push('/browse/' + this.state.value);
  }

  render() {
    console.log('RENDERING: <Search />');
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Enter a (collection) address you would like to browse:
          <input
            name="address"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="search" />
      </form>
    );
  }
}
