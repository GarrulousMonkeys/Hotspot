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
    <h4 className='card-title'>{item.name}</h4>
  <div className='top-info'>
    <img className='card-img-top thumbnail' src={item.yelpData.image ? item.yelpData.image : 'http://www.aviatorcameragear.com/wp-content/uploads/2012/07/placeholder-100x100.jpg'} />
    <div className='card-block'>
    </div>
    <div className='details'>
      <p className='spotinfo'>Rating: {item.rating}</p>
      <p className='spotinfo'>Type: {item.yelpData.cuisine}</p>
      <p className='spotinfo'>Neighborhood: {item.yelpData.neighborhoods ? item.yelpData.neighborhoods[0] : ''}</p>
    </div>
  </div>
      <p className='spotinfo'>What people think: "{item.yelpData.text}"</p>
  </div>
);
};


export default CollectionModel;
