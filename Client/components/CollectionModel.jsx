import React from 'react';
// const $ = require('jquery');
//
// $('.restaurant').tooltip();
//
// $(document).ready(function(){
// $('[data-toggle="tooltip"]').tooltip();
//
// });
// $('#restaurant');

var CollectionModel = ({item}) => {
  return (
  <div id='restaurant' className='restaurant card' >
  {item.username}
    <img className='card-img-top' src={item.yelpData.image} />
    <div className='card-block'>
      <h4 className='card-title'>{item.name}</h4>
    </div>
    <ul className='list-group list-group-flush'>
      <li className='list-group-item'>Rating: {item.rating}</li>
      <li className='list-group-item'>Type: {item.yelpData.cuisine}</li>
      <li className='list-group-item'>Neighborhood: {item.yelpData.neighborhoods ? item.yelpData.neighborhoods[0] : ''}</li>
      <li className='list-group-item'>What people think: "{item.yelpData.text}"</li>
      <li className='list-group-item'></li>
    </ul>
  </div>
);
};


export default CollectionModel;
