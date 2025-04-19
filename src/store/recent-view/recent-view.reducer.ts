import { combineReducers } from 'redux';

import productRecentViewReducer from './product/product.reducer';

export default combineReducers({
  product: productRecentViewReducer,
});
