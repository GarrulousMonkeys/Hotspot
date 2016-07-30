import { FETCH_NEAR_ME } from '../actions/index';

const initialState = {
  collection: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_NEAR_ME:

      return {
        ...state,
        collection: action.payload.data
      }
    default:
      return state;
  }
}
