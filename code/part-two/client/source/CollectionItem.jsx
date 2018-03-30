import React from 'react';

export function CollectionItem(props) {
  console.log('RENDERING: <CollectionItem />');
  const isSelected = props.match.params.mojiAddr === props.address;
  return (
    <div
      onClick={() => {
        props.history.push(
          '/browse/' + props.match.params.collectionAddr
          + '/' + props.address
        );
      }}
      style={{ fontWeight: isSelected ? 'bold' : 'normal' }}
    >
      {props.address}, gen {props.generation}
    </div>
  );
}
