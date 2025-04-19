import { combineReducers } from 'redux';
import listModelReducer from './listing.reducer';
import detailModelReducer from './detail.reducer';

export default combineReducers({
  list: listModelReducer,
  detail: detailModelReducer,
});
