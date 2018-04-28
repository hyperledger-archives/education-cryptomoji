import React from 'react';
import { Link } from 'react-router-dom';

export function MojiItem(props) {
  console.log('RENDERING: <MojiItem />');
  return (
    <div>
      <Link to={'/moji/' + props.address}>
        {props.address}
      </Link>
    </div>
  );
}
