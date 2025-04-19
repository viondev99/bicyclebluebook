import { combineReducers } from 'redux';

import listingsReducer from './listings/listings.reducer';
import profilePersonalReducer from './profile/profile.reducer';
import favoritesReducer from './favorites/favorites.reducer';
import ordersReducer from './orders/orders.reducer';
import wishlistReducer from './wishlist/wishlist.reducer';
import offersReducer from './offers/offers.reducer';
import notificationReducer from './notification/notification.reducer';
import tradeCreditReducer from './trade-credit/trade-credit.reducer';
import giftCardReducer from './gift-card/gift-card.reducer';

export default combineReducers({
  profile: profilePersonalReducer,
  listings: listingsReducer,
  favorites: favoritesReducer,
  orders: ordersReducer,
  wishlist: wishlistReducer,
  offers: offersReducer,
  notification: notificationReducer,
  tradeCredit: tradeCreditReducer,
  giftCard: giftCardReducer,
});
