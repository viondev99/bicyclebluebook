import { combineReducers } from 'redux';
import marketplaceReducer from './list/list.reducer';
import detailMarketplaceReducer from './detail/detail.reducer';

export default combineReducers({
  list: marketplaceReducer,
  detail: detailMarketplaceReducer,
});
