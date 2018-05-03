import React from 'react';
import { Link } from 'react-router-dom';

export function ResponseListItem({ moji }) {
  return (
    <li key={moji}><Link to={'/browse/' + moji}>{moji}</Link></li>
  );
}
