import { combineReducers } from 'redux';

import orderReducer from './orders/orders.reducer';
import offersHistoryReducer from './offers-history/offers-history.reducer';
import listingOnlineStoreReducer from './listings/listings.reducer';
import storefrontAccountReducer from './account/account.reducer';
import storefrontDashboardReducer from './dashboard/dashboard.reducer';

export default combineReducers({
  dashboard: storefrontDashboardReducer,
  account: storefrontAccountReducer,
  order: orderReducer,
  offersHistory: offersHistoryReducer,
  listingOnlineStore: listingOnlineStoreReducer,
});
