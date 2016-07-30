import React from 'react';

var NearbyModel = ({item}) => {
  return (
  <div id='restaurant' className='restaurant card' >
    <h4 className='card-title'>{item.name}</h4>
  <div className='top-info'>
    <img className='card-img-top thumbnail' src={item.yelpData.image ? item.yelpData.image : 'http://www.aviatorcameragear.com/wp-content/uploads/2012/07/placeholder-100x100.jpg'} />
    <div className='card-block'>
    </div>
    <div className='details'>
      <p className='spotinfo'>Type: {item.cuisine}</p>
      <p className='spotinfo'>Neighborhood: {item.neighborhoods ? item.yelpData.neighborhoods[0] : ''}</p>
    </div>
  </div>
      <p className='spotinfo'>What people think: "{item.text}"</p>
  </div>
);
};


export default NearbyModel;
