import React from 'react';

import { api } from './utils/fakeApi';

export class MojiDetails extends React.Component {
  componentDidMount() {
    this.fetchMoji(this.props.moji.address);
  }

  componentWillReceiveProps(nextProps, prevState) {
    const address = nextProps.moji.address;
    if (address !== prevState.address) {
      this.fetchMoji(address);
    }
  }

  fetchMoji(address) {
    return api.GET_CRYPTOMOJI(address)
      .then(moji => {
        this.setState({ address, moji });
      })
      .catch(err => {
        console.error(`Fetch moji failed for ${address}`, err);
        this.setState({ address, moji: null });
      });
  }

  render() {
    console.log('RENDERING: <MojiDetails />');
    if (!this.state) {
      return <div>Loading...</div>;
    }

    const { address, moji } = this.state;
    if (!moji) {
      return <div>We can't find anything for <code>{address}</code>!</div>;
    }

    return (
      <div>
        <h2>Details for <code>{address}</code> moji!</h2>
        <table>
          <tbody>
            {Object.entries(moji).map(keyValuePair => (
              <tr key={keyValuePair[0]}>
                <td>{keyValuePair[0]}</td>
                <td>{keyValuePair[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
