import { NAV_CLICK_FILTER } from '../actions/index';
import { NAV_CLICK_COLLECTION } from '../actions/index';
import { NAV_CLICK_PROFILE } from '../actions/index';
import { NAV_CLICK_NEARBY } from '../actions/index';

const initialState = {
  panelMode: 'none',
  isOpen: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NAV_CLICK_FILTER:
      return {
        ...state,
        panelMode: action.payload.panelMode,
        isOpen: action.payload.isOpen
      };
    case NAV_CLICK_COLLECTION:
      return {
        ...state,
        panelMode: action.payload.panelMode,
        isOpen: action.payload.isOpen
      };

    case NAV_CLICK_PROFILE:
      return {
        ...state,
        panelMode: action.payload.panelMode,
        isOpen: action.payload.isOpen
      };

    case NAV_CLICK_NEARBY:
      return {
        ...state,
        panelMode: action.payload.panelMode,
        isOpen: action.payload.isOpen
      };

    default:
      return state;
  }
}
