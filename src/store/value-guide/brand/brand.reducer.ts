import { combineReducers } from 'redux';
import detailModelReducer from './detail.reducer';

export default combineReducers({
  detail: detailModelReducer,
});
