import { combineReducers } from 'redux';
import CollectionRestaurantsFilters from './reducer_collection_restaurants';
import FilterSelectedRestaurants from './reducer_filtered_restaurants';
import PanelMode from './reducer_panel_mode';
import User from './reducer_user';

const rootReducer = combineReducers({
  CollectionRestaurantsFilters: CollectionRestaurantsFilters,
  FilterSelectedRestaurants: FilterSelectedRestaurants,
  PanelMode: PanelMode,
  User: User,
});

export default rootReducer;
