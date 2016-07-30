import _ from 'lodash';
import req from 'axios';
// import User from '../../server/db/Users';

export const NAV_CLICK_COLLECTION = 'NAV_CLICK_COLLECTION';
export const NAV_CLICK_FILTER = 'NAV_CLICK_FILTER';
export const NAV_CLICK_PROFILE = 'NAV_CLICK_PROFILE';
export const NAV_CLICK_NEARBY = 'NAV_CLICK_NEARBY';
export const PANEL_CLICK_FILTER_ITEM = 'PANEL_CLICK_FILTER_ITEM';
export const MAP_CONFIRM_POINT = 'MAP_CONFIRM_POINT';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const CREATE_FILTERS = 'CREATE_FILTERS';
export const FETCH_USER = 'FETCH_USER';


// Click Handler for Nav Collection button
export function toggleCollectionList(panelMode, isOpen) {
  // If panelMode is collection, set it to null.
  if (panelMode === 'collection' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to collection
    panelMode = 'collection';
    isOpen = true;
  }

  return {
    type: NAV_CLICK_COLLECTION,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}

export function toggleProfileList(panelMode, isOpen) {
  // If panelMode is profile, set it to null.
  if (panelMode === 'profile' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to profile
    panelMode = 'profile';
    isOpen = true;
  }

  return {
    type: NAV_CLICK_PROFILE,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}

export function toggleNearbyList(panelMode, isOpen) {
  if (panelMode === 'nearby' && isOpen === true) {
    isOpen = false;
  } else {
    panelMode = 'nearby';
    isOpen = true;
  }

  return {
    type: NAV_CLICK_NEARBY,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}

// Click Handler for Nav Filter button
export function toggleFilterList(panelMode, isOpen) {
  // If panelMode is filter, set it to null.
  if (panelMode === 'filter' && isOpen === true) {
    isOpen = false;
  } else {
    // Else set panelMode to filter
    panelMode = 'filter';
    isOpen = true;
  }

  return {
    type: NAV_CLICK_FILTER,
    payload: {
      panelMode: panelMode,
      isOpen: isOpen
    }
  };
}

// Click Handler for Panel Filter item
export function toggleFilter(filter, selectedFilters, collection) {
  // Check if given filter is in filter list
  const index = _.findIndex(selectedFilters, (o) => { return o === filter; });
  if (index === -1) {
    // Add it to the list if not found
    selectedFilters.push(filter);
  } else {
    // remove it if it is not
    selectedFilters.splice(index, index + 1);
  }

  // make a list of the restaurants that match the filter
  let filteredRestaurants = [];
  _.map(collection, (spot) => {
    if (_.findIndex(selectedFilters, (o) => { return o === spot.yelpData.cuisine; }) > -1) {
      filteredRestaurants.push(spot);
    }
  });
  return {
    type: PANEL_CLICK_FILTER_ITEM,
    payload: {
      selectedFilters: selectedFilters.slice(),
      filteredRestaurants: filteredRestaurants.slice()
    }
  };
}

// Click Handler for Panel Collection item
export function viewCollectionItem(item) {
  // change current panel view to the collection item
  return {
    type: PANEL_OPEN_COLLECTION_ITEM,
    payload: item
  };
}

// Click Handler for Panel Collection closeup
export function closeCollectionItem(item) {
  // close the current panel view back to the collection
  return {
    type: PANEL_CLOSE_COLLECTION_ITEM
  };
}

// NOTE: Not in use
// export function deleteCollectionItem(item) {
//   // delete the collection item from the db
//   const collection = req.del(endpoints.spots + '/' + item.id);
//   // update the collection and filters
//   const filters = filterOrganizer(collection);

//   return {
//     type: PANEL_DELETE_COLLECTION_ITEM,
//     payload: {
//       collection: collection.slice(),
//       filters: filters.slice()
//     }
//   };
// }

export function fetchCollection() {
  // This function should only be called once on startup
  // Query database for user's entire collection
  const collection = req.get('/api/spots');

  return {
    type: FETCH_COLLECTION,
    payload: collection
  };
}

export function clickLocationSubmit(name, latitude, longitude, rating) {
  // Create object to make DB query
  const spotToAdd = {
    name: name,
    latitude: latitude,
    longitude: longitude,
    rating: rating
  };

  const collection = req.post('/api/spots', spotToAdd)
    .then(() => {
      return req.get('/api/spots');
    });
  
  return {
    type: FETCH_COLLECTION,
    payload: collection
  };
}

export function fetchUser() {
  const user = req.get('/api/spots');
  return {
    type: FETCH_USER,
    payload: user
  };
}

export function createFilters(collection, filters) {

  _.map(collection, (spot) => {
    if (_.findIndex(filters, (o) => {
      return o === spot.yelpData.cuisine;
    }) === -1) {
      filters.push(spot.yelpData.cuisine);
    }

  });

  return {
    type: CREATE_FILTERS,
    payload: filters
  };
}

