import dayjs from 'dayjs';
import CookieBrowser from 'js-cookie';
import { V3_USER_KEY } from 'constants/common';
import { LoginResponse } from 'model/api/authenticate.model';
import { createCustomGaAnalyticsRequest, CreateGaAnalyticsParams } from 'api/analytics.api';
import { checkExistLocalStorage } from './utilities.helper';

export interface CreateGaAnalytics {
  from: string;
  name: string;
}

let cacheChangeRouter: string = '';

enum TYPE_COLLECTION {
  HOME = 'HOME',
  VIEW_CART = 'VIEW_CART',
  CHECKOUT_SHIPPING = 'CHECKOUT_SHIPPING',
  CHECKOUT_PAYMENT = 'CHECKOUT_PAYMENT',
  CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS',
}
const LIST_ENUM_COLLECTION = [
  'about',
  'account',
  'articles',
  'become_a_partner',
  'bike_finder',
  'buy_now',
  'checkout_payment',
  'checkout_shipping',
  'checkout_success',
  'compare',
  'dealer_locator',
  'home',
  'login',
  'logout',
  'login_register',
  'marketplace',
  'notification',
  'register',
  'register_success',
  'sell_tradein',
  'sell_your_bike',
  'store_front',
  'trade_in',
  'trade_in_account',
  'value_guide',
  'view_cart',
  'reactivate_account',
  'privacy_policy',
];

const convertNamePage = (name: string) => {
  if (!name) {
    return '';
  }
  const listNameSplit = name.split('/');
  if (listNameSplit.length > 1) {
    const listNameSplit1 = listNameSplit[1].split('-').join('_').toUpperCase().split('?');
    return listNameSplit1[0];
  }
  const listNameSplit2 = name.toUpperCase().split('?');
  return listNameSplit2[0];
};

const getSession = async () => {
  const storageSessionGa = checkExistLocalStorage() ? localStorage.getItem('__SESSION_NAME__') : null;
  const parseStorageSessionGa = storageSessionGa ? JSON.parse(storageSessionGa) : null;

  // if not expired => renew time + return name
  if (parseStorageSessionGa && dayjs(new Date(), 'YYYY-MM-DD').unix() <= parseStorageSessionGa.expiredTime) {
    const dataStorage = {
      sessionName: parseStorageSessionGa.sessionName,
      expiredTime: dayjs(new Date(), 'YYYY-MM-DD').add(7, 'days').unix(),
    };
    if (checkExistLocalStorage()) {
      localStorage.setItem('__SESSION_NAME__', JSON.stringify(dataStorage));
    }

    return parseStorageSessionGa.sessionName;
  }

  // if not exist storage or expired
  const randomString = Math.random().toString(36).slice(2);
  const base64String = Buffer.from(randomString).toString('base64');
  const dataStorage = {
    sessionName: base64String,
    expiredTime: dayjs(new Date(), 'YYYY-MM-DD').add(7, 'days').unix(),
  };
  if (checkExistLocalStorage()) {
    localStorage.setItem('__SESSION_NAME__', JSON.stringify(dataStorage));
  }

  return Buffer.from(randomString).toString('base64');
};
const createCustomGaAnalytics = async (_payload: CreateGaAnalytics, type: string) => {
  const sessionName = await getSession();
  let payload: CreateGaAnalyticsParams = {
    ..._payload,
    type,
    session: sessionName,
    user_id: '',
    user_name: '',
  };
  const storageUserInfo = CookieBrowser.get(V3_USER_KEY);
  if (storageUserInfo) {
    const parseUserInfo: LoginResponse = JSON.parse(storageUserInfo);
    payload = {
      ...payload,
      user_id: parseUserInfo?.account,
      user_name: parseUserInfo?.display_name,
    };
  }
  return createCustomGaAnalyticsRequest(payload);
};

export const setCustomGaRequest = (type: string, data: CreateGaAnalytics) => {
  if (cacheChangeRouter === data.name) {
    return;
  }
  cacheChangeRouter = data.name;

  let payload: CreateGaAnalytics = data
    ? {
        ...data,
      }
    : null;

  if (type === 'page_view') {
    if (data.name === '/') {
      payload = {
        ...payload,
        name: TYPE_COLLECTION.HOME,
      };
      return createCustomGaAnalytics(payload, type);
    }
    if (data.name.includes(`/cart`)) {
      payload = {
        ...payload,
        name: TYPE_COLLECTION.VIEW_CART,
      };
      return createCustomGaAnalytics(payload, type);
    }
    if (data.name.includes(`/checkout/shipping`)) {
      payload = {
        ...payload,
        name: TYPE_COLLECTION.CHECKOUT_SHIPPING,
      };
      return createCustomGaAnalytics(payload, type);
    }
    if (data.name.includes(`/checkout/payment`)) {
      payload = {
        ...payload,
        name: TYPE_COLLECTION.CHECKOUT_PAYMENT,
      };
      return createCustomGaAnalytics(payload, type);
    }
    if (data.name.includes(`/checkout/success`)) {
      payload = {
        ...payload,
        name: TYPE_COLLECTION.CHECKOUT_SUCCESS,
      };
      return createCustomGaAnalytics(payload, type);
    }

    const _name = convertNamePage(payload.name);
    for (const item of LIST_ENUM_COLLECTION) {
      if (_name?.toLocaleLowerCase().includes(item.toLocaleLowerCase())) {
        const _payload = {
          ...payload,
          name: item,
        };
        return createCustomGaAnalytics(_payload, type);
      }
    }
  }
  return createCustomGaAnalytics(payload, type);
};
