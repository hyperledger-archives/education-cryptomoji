import React from 'react';
import { Link } from 'react-router-dom';

export function CollectionItem(props) {
  console.log('RENDERING: <CollectionItem />');
  return (
    <div>
      <Link to={"/browse/" + props.address}>
        {props.address}
      </Link>, gen {props.generation}
    </div>
  );
}
