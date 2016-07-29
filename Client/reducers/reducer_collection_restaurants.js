import { MAP_CONFIRM_POINT } from '../actions/index';
import { FETCH_COLLECTION } from '../actions/index';

const initialState = {
  collection: []
};

export default function(state = initialState, action) {

  switch (action.type) {
    case FETCH_COLLECTION:
      return {
        ...state,
        collection: action.payload.data.data
      };
    default:
      return state;
  }
}
