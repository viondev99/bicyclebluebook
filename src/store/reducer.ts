import { combineReducers, Reducer } from 'redux';
import authenticateReducer from './authenticate/authenticate.reducer';
import commonReducer from './common/common.reducer';
import homeReducer from './home/home.reducer';
import tradeInReducer from './trade-in/trade-in.reducer';
import StoreState from '../model/store';
import marketplaceReducer from './marketplace/marketplace.reducer';
import valueGuideReducer from './value-guide/value-guide.reducer';
import accountReducer from './account/account.reducer';
import recentViewReducer from './recent-view/recent-view.reducer';
import compareReducer from './compare/compare.reducer';
import infoReducer from './info/info.reducer';
import messageReducer from './message/message.reducer';
import storeFrontReducer from './store-front/store-front.reducer';
import checkoutReducer from './checkout/checkout.reducer';
import partnerReducer from './partner/partner.reducer';
import dealerLocatorReducer from './dealer-locator/dealer-locator.reducer';
import sellerReducer from './marketplace/seller/seller.reducer';
import notificationReducer from './notification/notification.reducer';

const rootReducer = combineReducers<StoreState>({
  authenticate: authenticateReducer,
  common: commonReducer,
  home: homeReducer,
  tradeIn: tradeInReducer,
  marketplace: marketplaceReducer,
  valueGuide: valueGuideReducer,
  account: accountReducer,
  recentView: recentViewReducer,
  compare: compareReducer,
  info: infoReducer,
  message: messageReducer,
  notification: notificationReducer,
  storeFront: storeFrontReducer,
  checkout: checkoutReducer,
  partner: partnerReducer,
  dealerLocator: dealerLocatorReducer,
  sellerInfo: sellerReducer,
});

const withLogoutReducer = (reducer: Reducer) => (state: StoreState, action: any) => {
  if (action.type === 'authenticate/DO_LOGOUT') {
    return reducer(undefined, action);
  }
  return reducer(state, action);
};

export default withLogoutReducer(rootReducer);
