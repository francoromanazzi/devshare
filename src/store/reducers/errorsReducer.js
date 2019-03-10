import {
  GET_ERRORS,
  CLEAR_ERRORS,
  CLEAR_SPECIFIC_ERRORS
} from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        ...state,
        ...action.payload
      };
    case CLEAR_ERRORS:
      return {};
    case CLEAR_SPECIFIC_ERRORS:
      const ret = state;
      action.payload.forEach(err => delete ret[err]);
      return ret;
    default:
      return state;
  }
}
