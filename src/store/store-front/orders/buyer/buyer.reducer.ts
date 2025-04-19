import { combineReducers } from 'redux';

import listingOrder from './listing/listing.reducer';

export default combineReducers({
  listing: listingOrder,
});
