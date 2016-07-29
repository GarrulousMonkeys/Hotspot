import { combineReducers } from 'redux';
import CollectionRestaurantsFilters from './reducer_collection_restaurants';
import User from './reducer_user';
import FilterSelectedRestaurants from './reducer_filtered_restaurants';
import PanelMode from './reducer_panel_mode';

const rootReducer = combineReducers({
  User: User,
  CollectionRestaurantsFilters: CollectionRestaurantsFilters,
  PanelMode: PanelMode,
  FilterSelectedRestaurants: FilterSelectedRestaurants,
});

export default rootReducer;
