import { combineReducers } from 'redux';

import listingOrder from './listing/listing.reducer';
import detailOrder from './detail/detail.reducer';
import buyerReducer from './buyer/buyer.reducer';

export default combineReducers({
  listing: listingOrder,
  detail: detailOrder,
  buyer: buyerReducer,
});
