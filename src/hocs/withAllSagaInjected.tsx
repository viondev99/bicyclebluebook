import React, { ComponentType, FC, lazy, useEffect, useRef, useState } from 'react';
import { AppProps } from 'next/app';
import { NextPageContext } from 'next';
import { useStore } from 'react-redux';
import authenticateSaga from 'store/authenticate/authenticate.saga';
import commonSaga from 'store/common/common.saga';
import homeSaga from 'store/home/home.saga';
import tradeInSaga from 'store/trade-in/trade-in.saga';
import profilePersonalSaga from 'store/account/personal/profile/profile.saga';
import personalOrderSaga from 'store/account/personal/orders/orders.saga';
import marketplaceSaga from 'store/marketplace/marketplace.saga';
import listingsSaga from 'store/account/personal/listings/listings.saga';
import valueGuideSaga from 'store/value-guide/value-guide.saga';
import productRecentViewSaga from 'store/recent-view/product/product.saga';
import favoritesSaga from 'store/account/personal/favorites/favorites.saga';
import compareSaga from 'store/compare/compare.saga';
import wishlistSaga from 'store/account/personal/wishlist/wishlist.saga';
import infoSaga from 'store/info/info.saga';
import messageSaga from 'store/message/message.saga';
import storeFrontOrderSaga from 'store/store-front/orders/orders.saga';
import offersSaga from 'store/account/personal/offers/offers.saga';
import offersHistorySaga from 'store/store-front/offers-history/offers-history.saga';
import partnerSaga from 'store/partner/partner.saga';
import checkoutSaga from 'store/checkout/checkout.saga';
import listingsOnlineStoreSaga from 'store/store-front/listings/listings.saga';
import dealerLocatorSaga from 'store/dealer-locator/dealer-locator.saga';
import sellerSaga from 'store/marketplace/seller/seller.saga';
import storefrontAccountSaga from 'store/store-front/account/account.saga';
import notificationSettingSaga from 'store/account/personal/notification/notification.saga';
import storefrontDashboardSaga from 'store/store-front/dashboard/dashboard.saga';
import notificationSaga from 'store/notification/notification.saga';
import tradeCregitSaga from 'store/account/personal/trade-credit/trade-credit.saga';
import giftCardSaga from 'store/account/personal/gift-card/gift-card.saga';
import { SAGA_KEY } from './sagas.const';
import { ComponentStatic } from '../model/common';

export function importAllSaga() {
  const result = [
    favoritesSaga,
    giftCardSaga,
    listingsSaga,
    notificationSettingSaga,
    offersSaga,
    personalOrderSaga,
    profilePersonalSaga,
    tradeCregitSaga,
    wishlistSaga,
    // authenticateSaga,
    // checkoutSaga,
    // commonSaga,
    compareSaga,
    dealerLocatorSaga,
    homeSaga,
    // infoSaga,
    sellerSaga,
    // marketplaceSaga,
    // messageSaga,
    notificationSaga,
    partnerSaga,
    productRecentViewSaga,
    listingsOnlineStoreSaga,
    storefrontAccountSaga,
    offersHistorySaga,
    storeFrontOrderSaga,
    storefrontDashboardSaga,
    tradeInSaga,
    valueGuideSaga,
  ];
  const listKey = [
    SAGA_KEY.PersonalFavourite,
    SAGA_KEY.PersonalGiftCard,
    SAGA_KEY.PersonalListing,
    SAGA_KEY.PersonalNotification,
    SAGA_KEY.PersonalOffers,
    SAGA_KEY.PersonalOrder,
    SAGA_KEY.PersonalProfile,
    SAGA_KEY.PersonalTradeCredit,
    SAGA_KEY.PersonalWishlist,
    // SAGA_KEY.Authentication,
    // SAGA_KEY.Checkout,
    // SAGA_KEY.Common,
    SAGA_KEY.Compare,
    SAGA_KEY.DealerLocator,
    SAGA_KEY.Home,
    // SAGA_KEY.Info,
    SAGA_KEY.Seller,
    // SAGA_KEY.Marketplace,
    // SAGA_KEY.Message,
    SAGA_KEY.Notification,
    SAGA_KEY.Partner,
    SAGA_KEY.RecentProduct,
    SAGA_KEY.StoreListing,
    SAGA_KEY.StoreAccount,
    SAGA_KEY.StoreOffers,
    SAGA_KEY.StoreOrders,
    SAGA_KEY.StoreDashboard,
    SAGA_KEY.TradeIn,
    SAGA_KEY.ValueGuide,
  ];
  return result.map((saga, index) => ({
    saga,
    key: listKey[index],
  }));
}

type WrappedComponent = ComponentType & {
  getInitialProps?: (app: NextPageContext) => Promise<any>;
} & ComponentStatic;

interface AppComponent {
  getInitialProps: (ctx: NextPageContext) => Promise<any>;
}
const useComponentWillMount = (cb: any) => {
  const willMount = useRef(true);
  if (willMount.current) cb();
  willMount.current = false;
};
export function withInjectAllSaga<Props = any>(Wrapped: WrappedComponent) {
  let allSagaInjected = false;
  const WithInjectSaga: FC<Props & AppProps & any> & ComponentStatic = (props) => {
    const { pageProps, ...other } = props;
    const store = useStore();
    useComponentWillMount(() => {
      const allSaga = importAllSaga();
      // allSaga.forEach(({ saga, key }) => {
      //   return props.ctx.store.injectSaga(key, saga);
      // });
      if (allSaga?.length > 0 && !allSagaInjected) {
        allSagaInjected = true;
        allSaga.forEach(({ saga, key }) => {
          (store as any).injectSaga(key, saga);
        });
      }
    });
    return <Wrapped {...pageProps} {...other} />;
  };
  WithInjectSaga.getInitialProps = async (ctx: NextPageContext) => {
    const allSaga = importAllSaga();
    allSaga.forEach(({ saga, key }) => {
      const task = (ctx.store as any).injectSaga(key, saga);
      if (task) {
        (ctx.store as any).sagaAllTask.push(task);
      }
    });
    return {
      pageProps: {
        ...(Wrapped.getInitialProps ? await Wrapped.getInitialProps(ctx) : {}),
      },
    };
  };
  WithInjectSaga.renderLayout = Wrapped.renderLayout;

  return WithInjectSaga;
}
