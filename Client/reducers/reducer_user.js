import { FETCH_USER } from '../actions/index';

const initialState = {
  User: ''
};

export default function(state = initialState, action) {
 console.log(action);
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        User: action.payload.data.data[0].username
      }
    default:
      return state;
  }
}
