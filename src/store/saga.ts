import { fork } from '@redux-saga/core/effects';
import checkoutSaga from './checkout/checkout.saga';
import authenticateSaga from './authenticate/authenticate.saga';
import commonSaga from './common/common.saga';
import infoSaga from './info/info.saga';
import marketplaceSaga from './marketplace/marketplace.saga';
import messageSaga from './message/message.saga';

export default function* rootSaga() {
  try {
    yield fork(authenticateSaga);
    yield fork(commonSaga);
    yield fork(infoSaga);
    // yield fork(homeSaga);
    // yield fork(tradeInSaga);
    // yield fork(profilePersonalSaga);
    yield fork(marketplaceSaga);
    // yield fork(listingsSaga);
    // yield fork(valueGuideSaga);
    // yield fork(productRecentViewSaga);
    // yield fork(compareSaga);
    // yield fork(personalOrderSaga);
    // yield fork(wishlistSaga);
    // yield fork(favoritesSaga);
    // yield fork(giftCardSaga);
    // yield fork(offersSaga);
    // yield fork(infoSaga);
    yield fork(messageSaga);
    // yield fork(storeFrontOrderSaga);
    yield fork(checkoutSaga);
    // yield fork(offersHistorySaga);
    // yield fork(partnerSaga);
    // yield fork(listingsOnlineStoreSaga);
    // yield fork(dealerLocatorSaga);
    // yield fork(sellerSaga);
    // yield fork(storefrontDashboardSaga);
    // yield fork(storefrontAccountSaga);
    // yield fork(notificationSaga);
    // yield fork(notificationSettingSaga);
    // yield fork(tradeCregitSaga);
  } catch (e) {
    console.log(e);
  }
}
