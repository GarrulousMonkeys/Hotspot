import { combineReducers } from 'redux';
import CollectionRestaurantsFilters from './reducer_collection_restaurants';
import User from './reducer_user';
import Nearby from './reducer_near_me';
import FilterSelectedRestaurants from './reducer_filtered_restaurants';
import PanelMode from './reducer_panel_mode';

const rootReducer = combineReducers({
  User: User,
  Nearby: Nearby,
  CollectionRestaurantsFilters: CollectionRestaurantsFilters,
  FilterSelectedRestaurants: FilterSelectedRestaurants,
  PanelMode: PanelMode
});

export default rootReducer;
