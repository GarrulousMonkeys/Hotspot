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
<div className='spot-container'>
  <h4 className='card-title'>{item.name}</h4>
   <a className='collection-card' href={`http://www.yelp.com/biz/${item.yelpData.businessId}`}>
    <div className='restaurant' >
    <div className='top-info'>
      <div className='image-container'>
        <img className='yelp-image' src={item.yelpData.image ? item.yelpData.image.slice(0, -6) + 'l.jpg' : 'http://www.aviatorcameragear.com/wp-content/uploads/2012/07/placeholder-100x100.jpg'} />
      </div>
        <div className='details'>
          <div className='spot-box-rating'>
            <p className='spot-info-title'>Rating</p><p className='spot-info-rating'>{item.rating}</p>
          </div>
          <div className='spot-box'>
            <p className='spot-info-title'>Type</p><p className='spot-info'>{item.yelpData.cuisine ? item.yelpData.cuisine : 'N/A'}</p>
          </div>
          <div className='spot-box'>
            <p className='spot-info-title'>Neighborhood</p><p className='spot-info'>{item.yelpData.neighborhoods ? item.yelpData.neighborhoods[0] : 'N/A'}</p>
          </div>
        </div>
        <div className='quote-box'>
          <p className='spot-info-title'>What people think</p> <p className='quote'>"{item.yelpData.text}"</p>
        </div>
      </div>
    </div>
   </a>
</div>
);
};


export default CollectionModel;

// 