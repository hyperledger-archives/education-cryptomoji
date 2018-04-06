import React from 'react';
import { Link } from 'react-router-dom';

export class Moji extends React.Component {
  render() {
    console.log('RENDERING: <Moji />');
    const { address, moji } = this.props;
    if (!moji) {
      return (
        <div>
          We can't find anything for a moji at <code>{address}</code>!
        </div>
      );
    }

    return (
      <div>
        <h2>Details for <code>{address}</code> moji!</h2>
        <table>
          <tbody>
            <tr><td>address</td><td>{moji.address}</td></tr>
            <tr><td>dna</td><td>{moji.dna}</td></tr>
            <tr>
              <td>collection</td>
              <td><Link to={'/browse/' + moji.collection}>{moji.collection}</Link></td>
            </tr>
            <tr>
              <td>sire</td>
              <td><Link to={'/browse/' + moji.sire}>{moji.sire}</Link></td>
            </tr>
            <tr>
              <td>breeder</td>
              <td><Link to={'/browse/' + moji.breeder}>{moji.breeder}</Link></td>
            </tr>
            <tr>
              <td>sired</td>
              <td>
                {moji.sired.map(address => (
                  <Link key={address} to={'/browse/' + address}>{address},</Link>
                ))}
              </td>
            </tr>
            <tr>
              <td>bred</td>
              <td>
                {moji.bred.map(address => (
                  <Link key={address} to={'/browse/' + address}>{address},</Link>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
