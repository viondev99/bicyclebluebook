/* eslint-disable import/named */
import { call, select, delay, put, takeLatest, takeLeading } from 'redux-saga/effects';
import { Action } from 'redux-actions';
import CookieBrowser from 'js-cookie';
import { LoginResponse, ListStorefronts, ListStripeAccounts } from 'model/api/authenticate.model';
import {
  callLogin,
  impersonateUser,
  registerPersonal,
  registerOnlineStore,
  registerPersonalByGoogle,
  registerPersonalByFacebook,
  registerPersonalByTwitter,
  loginByGoogle,
  loginByFacebook,
  registerOnlinePartnerStore,
  fetchTokenStoreFont,
} from 'api/authenticate.api';
import StoreState from 'model/store';
import {
  LoginModel,
  RegisterPersonalModel,
  RegisterPersonalByFacebookModel,
  RegisterPersonalByGoogleModel,
  RegisterPersonalByTwitterModel,
  RegisterTradeInModel,
  GenerateTokenOnlineStoreParams,
  cleclearStoreFrontTokenPayload,
} from 'model/store/authenticate.model';
import Router from 'next/router';
import { objectToFormData } from 'helpers/objectToFormdata.helper';
import trim from 'lodash/trim';
import _unset from 'lodash/unset';
import pick from 'lodash/pick';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import { checkExistLocalStorage, kountConfigEnv } from 'helpers/utilities.helper';
import { isServerSide } from 'helpers/ssr.helper';
import { getProfile } from 'api/account/personal/profile.api';
import { RegisterOnlineStoreModel } from '../../model/store/authenticate.model';
import * as authenticateActions from './authenticate.action';
import { getMessageFromError, shouldRedirectWhenLoginTo } from '../../helpers/common.helper';
import {
  COOKIE_OPTION,
  V3_TOKEN_KEY,
  V3_USER_KEY,
  STOREFRONTS,
  STRIPEACCOUNTS,
  V3_BICYCLE_OUTLET_TOKEN_KEY,
  STOREFRONTS_SELECTED,
} from '../../constants/common';
import authorizedRequest from '../../helpers/request/authorizedRequest';

function onLoginSuccess() {
  const { query, replace } = Router;
  const redirectUrl =
    typeof query.redirectUrl === 'string' && shouldRedirectWhenLoginTo(query.redirectUrl) ? query.redirectUrl : '/';
  return replace(redirectUrl);
}

function* setSessionForLogin(
  response: LoginResponse & ListStorefronts & ListStripeAccounts,
  redirect: boolean = false,
) {
  const dataLoginCookies: LoginResponse = pick(response, [
    'account',
    'blocked',
    'date_created',
    'date_updated',
    'display_name',
    'email',
    'gravatar',
    'is_setting',
    'is_validate_address',
    'last_login',
    'partner',
    'partner_token',
    'provider',
    'receive_message',
    'restrict',
    'role',
    'salesforce_id',
    'setting',
    'storefront',
    'storefront_name',
    'stripe_account',
    'token',
    'user_name',
    '_id',
    'last_login_id',
    'is_bbb_rack',
    'is_bbb_seller',
  ]);
  const listStorefrontsLocalStorage: ListStorefronts = pick(response, ['storefronts']);
  const listStripeAccountsLocalStorage: ListStripeAccounts = pick(response, ['stripe_accounts']);
  CookieBrowser.set(V3_TOKEN_KEY, dataLoginCookies.token, COOKIE_OPTION);
  CookieBrowser.set(V3_USER_KEY, dataLoginCookies, COOKIE_OPTION);

  if (checkExistLocalStorage()) {
    localStorage.setItem(STOREFRONTS, JSON.stringify(listStorefrontsLocalStorage));
    localStorage.setItem(STRIPEACCOUNTS, JSON.stringify(listStripeAccountsLocalStorage));
    localStorage.setItem('CHECK_ROLE_NOTIFICATION', dataLoginCookies?.partner ? 'PARTNER' : 'NOT_PARTNER');
    localStorage.setItem(STOREFRONTS_SELECTED, '');
  }

  authorizedRequest.setToken(response.token);
  yield put(authenticateActions.loginSucceeded(response, redirect));
}

function* generateTokenOnlineStoreSaga(action: Action<GenerateTokenOnlineStoreParams>) {
  try {
    const response: any = yield call(fetchTokenStoreFont, action.payload);
    if (checkExistLocalStorage()) {
      yield localStorage.setItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront, action.payload.storefront);
      yield localStorage.setItem(BICYCLE_OUTLET_LOGGED_INFO.nameOnlineStore, action.payload.name);
    }

    yield CookieBrowser.set(V3_BICYCLE_OUTLET_TOKEN_KEY, response.token, COOKIE_OPTION);

    if (action?.payload?.currentWidthScreen < 1200) {
      yield Router.replace({
        pathname: `/store-front/dashboards`,
        query: {
          isShowLeftMenu: true,
          name: action?.payload?.nameMenu,
        },
      });
    } else {
      yield Router.replace({
        pathname: `/store-front/dashboards`,
      });
    }
    // window.location.reload();
  } catch (error) {
    toastError(getMessageFromError(error));
  }
}

// eslint-disable-next-line require-yield
function* clearStoreFrontTokenSaga(action: Action<cleclearStoreFrontTokenPayload>) {
  try {
    if (CookieBrowser.get(V3_BICYCLE_OUTLET_TOKEN_KEY)) {
      if (process.browser && checkExistLocalStorage()) {
        localStorage.removeItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
        localStorage.removeItem(BICYCLE_OUTLET_LOGGED_INFO.nameOnlineStore);
      }
      CookieBrowser.remove(V3_BICYCLE_OUTLET_TOKEN_KEY);
    }
    if (action?.payload?.currentWidthScreen < 1200) {
      yield Router.replace({
        pathname: `/store-front/dashboards`,
        query: {
          isShowLeftMenu: true,
          name: action?.payload?.nameMenu,
        },
      });
    } else {
      yield Router.replace({
        pathname: `/store-front/dashboards`,
      });
      // window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

function* doLogin(action: Action<LoginModel>) {
  try {
    const response: LoginResponse & ListStorefronts & ListStripeAccounts = yield call(
      callLogin,
      trim(action.payload.email),
      action.payload.password,
    );
    if (response?.session_id !== undefined) {
      import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        kountSDK(kountConfigEnv(), response.session_id);
      });
    }
    if (action.payload.roles && !action.payload.roles.includes(response.role)) {
      throw new Error('You cannot do this action with this account, please try with difference account');
    }
    yield Router.replace({ query: { ...Router.query, login: undefined, redirecting: true } }, Router.asPath); // DISMISS LOGIN DIALOG BEFORE DO ANYTHING
    if (response.partner) {
      yield Router.replace({
        pathname: `/trade-in-account/tp-dashboard`,
        query: { isLogin: true },
      });
    } else {
      yield call(onLoginSuccess);
    }
    yield call(setSessionForLogin, response, !!response.partner);
    toastSuccess(t('authenticate.logInSuccessfully'), t('seoTitle.success'));
  } catch (error) {
    yield put(authenticateActions.loginFailed());
    if (error?.response?.status === 410) {
      yield Router.push({
        pathname: Router.pathname,
        query: { reactivate: action.payload.email },
      });
    } else {
      toastError(getMessageFromError(error));
    }
  }
}

function* initSession(action: Action<authenticateActions.InitSessionPayload>) {
  try {
    if (!isServerSide()) {
      authorizedRequest.setToken(action.payload.token);
    }

    yield put(authenticateActions.initSessionComplete());
  } catch (e) {
    yield put(authenticateActions.initSessionComplete());
  }
}

function* handleImpersonate(action: Action<string>) {
  try {
    const isLogging: boolean = yield select((store: StoreState) => !!store.authenticate.token);
    if (isLogging) {
      yield put(authenticateActions.logout());
    }
    const response: LoginResponse & ListStorefronts & ListStripeAccounts = yield call(impersonateUser, action.payload);
    yield Router.replace({ query: { ...Router.query, login: undefined, redirecting: true } }, Router.asPath); // DISMISS LOGIN DIALOG BEFORE DO ANYTHING
    if (response.partner) {
      yield Router.replace({
        pathname: `/trade-in-account/tp-dashboard`,
        query: { isLogin: true },
      });
    } else {
      yield call(onLoginSuccess);
    }
    yield call(setSessionForLogin, response, !!response.partner);
    yield put(authenticateActions.impersonateSucceeded(response));
    toastSuccess(t('authenticate.logInSuccessfully'), t('seoTitle.success'));
  } catch (error) {
    yield put(authenticateActions.impersonateFailed());
    toastError(getMessageFromError(error));
  }
}

function* handleRegisterPersonal(action: Action<RegisterPersonalModel>) {
  try {
    const response = yield call(registerPersonal, action.payload);
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded({ name: response.display_name, token: response.token }));
    yield put(authenticateActions.registerPersonalSucceeded(response));
    yield call(Router.push, '/');
    toastSuccess(t('authenticate.registerSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    toastError(e || e.message);
    yield put(authenticateActions.registerFailed());
  }
}

function* handleRegisterPersonalByGoogle(action: Action<RegisterPersonalByGoogleModel>) {
  try {
    const response = yield call(registerPersonalByGoogle, action.payload);
    if (response?.session_id !== undefined) {
      import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        kountSDK(kountConfigEnv(), response.session_id);
      });
    }
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded({ name: response.display_name, token: response.token }));
    yield put(authenticateActions.registerPersonalSucceeded(response));
    yield call(Router.push, '/');
    toastSuccess(t('authenticate.registerSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    toastError(e || e.message);
    yield put(authenticateActions.registerFailed());
  }
}

function* handleRegisterPersonalByFacebook(action: Action<RegisterPersonalByFacebookModel>) {
  try {
    const response = yield call(registerPersonalByFacebook, action.payload);
    if (response?.session_id !== undefined) {
      import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        kountSDK(kountConfigEnv(), response.session_id);
      });
    }
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded({ name: response.display_name, token: response.token }));
    yield put(authenticateActions.registerPersonalSucceeded(response));
    yield call(Router.push, '/');
    toastSuccess(t('authenticate.registerSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    toastError(e || e.message);
    yield put(authenticateActions.registerFailed());
  }
}

function* handleRegisterPersonalByTwitter(action: Action<RegisterPersonalByTwitterModel>) {
  try {
    const response = yield call(registerPersonalByTwitter, action.payload);
    if (response?.session_id !== undefined) {
      import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        kountSDK(kountConfigEnv(), response.session_id);
      });
    }
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded({ name: response.display_name, token: response.token }));
    yield put(authenticateActions.registerPersonalSucceeded(response));
    yield call(Router.push, '/');
    toastSuccess(t('authenticate.registerSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    toastError(e || e.message);
    yield put(authenticateActions.registerFailed());
  }
}

function* handleRegisterOnlineStore(action: Action<RegisterOnlineStoreModel>) {
  try {
    const response = yield call(registerOnlineStore, action.payload);
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded({ name: response.display_name, token: response.token }));
    yield put(authenticateActions.registerOnlineStoreSucceeded(response));
    yield call(Router.push, '/');
    toastSuccess(t('authenticate.registerSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    toastError(e || e.message);
    yield put(authenticateActions.registerFailed());
  }
}

function* handleRegisterOnlinePartnerStore(action: Action<RegisterOnlineStoreModel>) {
  try {
    const formData = objectToFormData(action.payload, { indices: true });
    const response = yield call(registerOnlinePartnerStore, formData);
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded({ name: response.display_name, token: response.token }));
    yield put(authenticateActions.registerOnlineStoreSucceeded(response));
    yield call(Router.push, '/');
    toastSuccess(t('authenticate.registerSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    yield put(authenticateActions.registerFailed());
    toastError(e);
  }
}

function* handleRegisterTradeInPartner(action: Action<RegisterTradeInModel>) {
  try {
    const data = action.payload;
    if (!action.payload.isOnlinePartner) {
      _unset(data, 'online_store');
    }
    const formData = objectToFormData(data, { indices: true });
    const response = yield call(registerOnlinePartnerStore, formData);
    yield put(authenticateActions.registerTradeInPartnerSucceeded(response));
    yield call(Router.push, '/register-success');
  } catch (e) {
    yield put(authenticateActions.registerFailed());
    toastError(e);
  }
}

function* handleLoginByFacebook(action: Action<string>) {
  try {
    const response: LoginResponse & ListStorefronts & ListStripeAccounts = yield call(loginByFacebook, action.payload);
    if (response?.session_id !== undefined) {
      import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        kountSDK(kountConfigEnv(), response.session_id);
      });
    }
    yield Router.replace({ query: { ...Router.query, login: undefined, redirecting: true } }, Router.asPath); // DISMISS LOGIN DIALOG BEFORE DO ANYTHING
    yield call(setSessionForLogin, response);
    yield call(onLoginSuccess);
    toastSuccess(t('authenticate.logInSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    yield put(authenticateActions.loginFailed());
    toastError(e);
  }
}

function* handleLoginByGoogle(action: Action<string>) {
  try {
    const response: LoginResponse & ListStorefronts & ListStripeAccounts = yield call(loginByGoogle, action.payload);
    if (response?.session_id !== undefined) {
      import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
        kountSDK(kountConfigEnv(), response.session_id);
      });
    }
    yield Router.replace({ query: { ...Router.query, login: undefined, redirecting: true } }, Router.asPath); // DISMISS LOGIN DIALOG BEFORE DO ANYTHING
    yield call(setSessionForLogin, response);
    yield call(onLoginSuccess);
    toastSuccess(t('authenticate.logInSuccessfully'), t('seoTitle.success'));
  } catch (e) {
    yield put(authenticateActions.loginFailed());
    toastError(e);
  }
}

function* handleLoginByTwitter(action: Action<string>) {
  const data = yield JSON.parse(action.payload);
  if (data?.session_id !== undefined) {
    import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
      kountSDK(kountConfigEnv(), data.session_id);
    });
  }
  if (data?.token) {
    yield Router.replace({ query: { ...Router.query, login: undefined, redirecting: true } }, Router.asPath); // DISMISS LOGIN DIALOG BEFORE DO ANYTHING
    yield call(setSessionForLogin, data);
    yield call(onLoginSuccess);
    toastSuccess(t('authenticate.logInSuccessfully'), t('seoTitle.success'));
    Router.replace('/');
  }
  if (!data?.token && data?.twitter) {
    yield put(authenticateActions.saveInfoTwitter(data?.twitter));
    Router.replace('/register/personal');
  } else {
    yield put(authenticateActions.loginFailed());
    toastError(data?.message);
  }
}

function* handleLogout() {
  try {
    CookieBrowser.remove(V3_TOKEN_KEY);
    CookieBrowser.remove(V3_USER_KEY);
    CookieBrowser.remove(V3_BICYCLE_OUTLET_TOKEN_KEY);
    authorizedRequest.setToken('');
    const state = yield select();
    const socketConnection = state.checkout.cart?.socketConnection;
    if (socketConnection) {
      socketConnection.removeAllListeners();
      socketConnection.disconnect();
    }

    toastSuccess(t('authenticate.logoutSuccessfully'), t('seoTitle.success'));
    yield put(authenticateActions.doLogout());
    yield Router.replace('/');
    yield delay(3000);
    if (checkExistLocalStorage()) {
      localStorage.removeItem('CHECK_ROLE_NOTIFICATION');
    }
  } catch (e) {
    // yield put(authenticateActions.loginFailed());
    toastError(e);
  }
}
function* checkUserBlockedSaga(action: Action<string>) {
  try {
    const profile = yield call(getProfile, action.payload);
    const isBlocked = profile.user?.blocked;
    if (isBlocked) {
      yield put(authenticateActions.logout());
      toastError(t('authenticate.userBlocked'));
    }
  } catch (error) {
    // do nothing
  }
}

export default function* authenticateSaga() {
  yield takeLatest(authenticateActions.login, doLogin);
  yield takeLatest(authenticateActions.impersonate, handleImpersonate);
  yield takeLeading(authenticateActions.logout, handleLogout);
  yield takeLatest(authenticateActions.loginByFacebook, handleLoginByFacebook);
  yield takeLatest(authenticateActions.loginByGoogle, handleLoginByGoogle);
  yield takeLatest(authenticateActions.loginByTwitter, handleLoginByTwitter);
  yield takeLatest(authenticateActions.initSession, initSession);
  yield takeLatest(authenticateActions.registerPersonal, handleRegisterPersonal);
  yield takeLatest(authenticateActions.registerPersonalByGoogle, handleRegisterPersonalByGoogle);
  yield takeLatest(authenticateActions.registerPersonalByFacebook, handleRegisterPersonalByFacebook);
  yield takeLatest(authenticateActions.registerPersonalByTwitter, handleRegisterPersonalByTwitter);
  yield takeLatest(authenticateActions.registerOnlineStore, handleRegisterOnlineStore);
  yield takeLatest(authenticateActions.registerOnlinePartnerStore, handleRegisterOnlinePartnerStore);
  yield takeLatest(authenticateActions.registerTradeInPartner, handleRegisterTradeInPartner);
  yield takeLatest(authenticateActions.generateTokenOnlineStore, generateTokenOnlineStoreSaga);
  yield takeLatest(authenticateActions.clearStoreFrontToken, clearStoreFrontTokenSaga);
  yield takeLatest(authenticateActions.checkUserBlocked, checkUserBlockedSaga);
}
