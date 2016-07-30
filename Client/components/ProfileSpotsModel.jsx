import React from 'react';

var ProfileSpotsModel = ({item}) => {
  return (
    <div className='profile-spot' >
      <img src={item.rating === 0 ? '../components/Assets/thumbdown.png' : '../components/Assets/thumbup.png'} className='profile-thumb'/><a href={`http://www.yelp.com/biz/${item.yelpData.businessId }`}><span className='likes-title'>{item.name}</span></a>
    </div>
  );
};


export default ProfileSpotsModel;