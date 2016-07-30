import React from 'react';

// The contets will be dependant on the form the information takes
var FilterItem = ({filter, appliedFilters, toggleFilter, collection}) => {
  var cssClasses = 'filter-item';
  if (_.findIndex(appliedFilters, (o) => { return o === filter }) > -1) {
    cssClasses += ' active';
  }

  return (
    <div className='filter'>
      <div className={cssClasses} onClick={ () => { toggleFilter(filter, appliedFilters, collection); }}>
      {filter || 'Other'}
      </div>
    </div>
  );
};

export default FilterItem;
