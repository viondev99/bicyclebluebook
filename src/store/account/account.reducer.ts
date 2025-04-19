import { combineReducers } from 'redux';

import personalReducer from './personal/personal.reducer';

export default combineReducers({
  personal: personalReducer,
});
