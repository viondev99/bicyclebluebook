import { createStore, applyMiddleware, Store } from 'redux';
import { MakeStore } from 'next-redux-wrapper';
import createSagaMiddleware, { END, Task } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReactGA from 'react-ga4';
import get from 'lodash/get';
import * as Sentry from '@sentry/node';

import { V3_BICYCLE_OUTLET_TOKEN_KEY } from 'constants/common';
import CookieBrowser from 'js-cookie';
import rootReducer from './reducer';
import rootSaga from './saga';
import authorizedRequest from '../helpers/request/authorizedRequest';
import { tokenManager } from '../helpers/tokenManager.helper';
import { createLazySagaMiddleware, objectToArray } from './saga-lazy-middleware';
import * as valueGuideAction from './value-guide/value-guide.action';
import * as messageAction from './message/message.action';
import * as homeActions from './home/home.action';
import * as authenticateActions from './authenticate/authenticate.action';
import compareAction from './compare/compare.action';
import { SAGA_KEY } from '../hocs/sagas.const';

export const configStore: MakeStore = (initState, { isServer, req = null, pathname }) => {
  const sagaMiddleware = createSagaMiddleware();
  const injectedSagas = new Map();
  function isInjected(key: string) {
    return injectedSagas.has(key);
  }
  const injectSaga = (key: string, v: any) => {
    if (isInjected(key)) return;
    const task = sagaMiddleware.run(v);
    injectedSagas.set(key, task);
    return task;
  };

  const lazyMiddleWare = () => [
    // createLazySagaMiddleware(injectSaga, objectToArray(marketPlaceAction), SAGA_KEY.Marketplace, async () =>
    //   import('./marketplace/marketplace.saga').then((m) => m.default),isInjected
    // ),
    // createLazySagaMiddleware(injectSaga, objectToArray(sellerAction), SAGA_KEY.Seller, async () =>
    //   import('./marketplace/seller/seller.saga').then((m) => m.default),isInjected
    // ),
    createLazySagaMiddleware(
      injectSaga,
      objectToArray(valueGuideAction),
      SAGA_KEY.ValueGuide,
      async () => import('./value-guide/value-guide.saga').then((m) => m.default),
      isInjected,
    ),
    // createLazySagaMiddleware(injectSaga, objectToArray(tradeInAction), SAGA_KEY.TradeIn, async () =>
    //   import('./trade-in/trade-in.saga').then((m) => m.default),
    // ),
    // createLazySagaMiddleware(
    //   injectSaga,
    //   objectToArray(messageAction),
    //   SAGA_KEY.Message,
    //   async () => import('./message/message.saga').then((m) => m.default),
    //   isInjected,
    // ),
    // createLazySagaMiddleware(
    //   injectSaga,
    //   objectToArray(commonActions),
    //   SAGA_KEY.Common,
    //   async () => import('./common/common.saga').then((m) => m.default),
    //   isInjected,
    // ),
    createLazySagaMiddleware(
      injectSaga,
      objectToArray(homeActions),
      SAGA_KEY.Home,
      async () => import('./home/home.saga').then((m) => m.default),
      isInjected,
    ),
    createLazySagaMiddleware(
      injectSaga,
      objectToArray(compareAction),
      SAGA_KEY.Compare,
      async () => import('./compare/compare.saga').then((m) => m.default),
      isInjected,
    ),
    // createLazySagaMiddleware(
    //   injectSaga,
    //   objectToArray(cartAction, paymentAction, shippingAction),
    //   SAGA_KEY.Checkout,
    //   async () => import('./checkout/checkout.saga').then((m) => m.default),
    //   isInjected,
    // ),
    // createLazySagaMiddleware(injectSaga, objectToArray(authenticateActions), SAGA_KEY.Authentication, async () =>
    //   import('./authenticate/authenticate.saga').then((m) => m.default),isInjected
    // ),
  ];
  const store: Store & { sagaTask?: Task; sagaAllTask?: Task[]; injectSaga?: any } = createStore(
    rootReducer,
    initState,
    composeWithDevTools(applyMiddleware(...lazyMiddleWare(), sagaMiddleware)),
  );
  if (req || !isServer) {
    store.sagaTask = sagaMiddleware.run(rootSaga);
    store.sagaAllTask = [];
  }
  store.injectSaga = injectSaga;
  // if BICYCLE OUTLET => TOKEN: V3_BICYCLE_OUTLET_TOKEN_KEY
  if (initState?.authenticate?.token) {
    authorizedRequest.setToken(CookieBrowser.get(V3_BICYCLE_OUTLET_TOKEN_KEY) || initState?.authenticate?.token);
  }
  function subscribeForGA() {
    let currentValue: any;
    return function subscription() {
      const previousValue = currentValue;
      currentValue = get(store.getState(), 'authenticate.user._id');

      if (previousValue !== currentValue) {
        ReactGA.set({ userId: currentValue });
        Sentry.setUser(currentValue ? { id: currentValue } : null);
      }
    };
  }

  tokenManager.setLogoutMethod(() => {
    store.dispatch(authenticateActions.logout());
  });
  store.subscribe(subscribeForGA());

  return store;
};

export async function stopAndAwaitSagaTask(store: Store & { sagaAllTask?: Task[] }) {
  store.dispatch(END);
  const promises = Promise.all(store.sagaAllTask.map((i) => i.toPromise()));
  return promises;
}
