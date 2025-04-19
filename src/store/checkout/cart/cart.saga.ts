import { all, call, CallEffect, put, race, select, take, takeLeading } from '@redux-saga/core/effects';
import { Action, ActionMeta } from 'redux-actions';
import Router from 'next/router';
import lowerCase from 'lodash/lowerCase';
import CookieBrowser from 'js-cookie';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import StoreState from 'model/store';
import {
  addMultiple,
  addToCart,
  applyCoupon,
  CartResponse,
  CartStorageItem,
  cartStorageService,
  changeLocalPickup,
  changeQuantity,
  ChangeQuantityType,
  getCartByLocalData,
  // getCarts,
  removeFromCart,
} from 'api/checkout/cart.api';
import { addTag, getMessageFromError } from 'helpers/common.helper';
// import { DataList } from 'model/common';
import { CartModel } from 'model/store/checkout/cart.model';
import t from 'helpers/language';
import { RegisterPersonalModel } from 'model/store/authenticate.model';
import { registerPersonal } from 'api/authenticate.api';
import { COOKIE_OPTION, V3_TOKEN_KEY, V3_USER_KEY } from 'constants/common';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { addShipping, AddShippingBody, getShipping, GetShippingResponse } from 'api/checkout/shipping.api';
import { ShippingSingle } from 'model/store/checkout/shipping.model';
import cartAction, {
  AddCartItemPayload,
  ChangeLocalPickUpItemPayload,
  CreateAccountOnCheckoutPayload,
  ModifyCartItemPayload,
} from './cart.action';
import shippingAction from '../shipping/shipping.action';
import * as authenticateActions from '../../authenticate/authenticate.action';

function* handleGetCartWithCurrentShippingAndCoupon(shipping?: ShippingSingle, coupon?: string) {
  try {
    const isLoggedIn = yield select((store: StoreState) => !!store.authenticate.token);
    let _coupon = coupon;
    let _shipping = shipping;
    if (!_coupon) {
      _coupon = yield select((store: StoreState) => store.checkout.cart.couponCode);
    }
    if (!_shipping) {
      _shipping = yield select((store: StoreState) => store.checkout.cart.shipping);
    }
    const shippingPayload =
      _shipping && Object.keys(_shipping).length > 0
        ? {
            recipient_name: `${_shipping?.first_name} ${_shipping?.last_name}`,
            line1: _shipping?.line1,
            city: _shipping?.city,
            state: _shipping?.state,
            postal_code: _shipping?.postal_code,
            phone: _shipping?.phone,
          }
        : null;
    if (isLoggedIn) {
      const payload: {
        coupon_code: string;
        shipping_address?: typeof shippingPayload;
      } = { coupon_code: _coupon, shipping_address: shippingPayload };

      if (coupon) {
        const response: CartResponse = yield call(applyCoupon, payload);
        return response;
        // yield put(cartAction.getCartsSucceeded(response.carts));
      }
      const response: CartResponse = yield call(applyCoupon, {
        shipping_address: payload.shipping_address,
      });
      return response;
      // yield put(cartAction.getCartsSucceeded(response.carts));
    }
    let isResetCard = false;
    if (Router.pathname.includes('/checkout/success')) {
      isResetCard = true;
    }
    const cartLocal: CartStorageItem[] = cartStorageService.get();
    const response: CartResponse = yield call(getCartByLocalData, cartLocal, _coupon, shippingPayload, isResetCard);
    cartLocal.forEach((i) => {
      // Remove all cart not exists in response of server (might be removed or not have enough quantity)
      if (
        !response.carts.find(
          (cart) => cart.master_listing_id === i.master_listing_id && cart.frame_size === i.frame_size,
        )
      ) {
        cartStorageService.removeCart(i.master_listing_id, i.frame_size);
      }
    });
    return response;
  } catch (error) {
    toastError(error);
  }

  // yield put(cartAction.getCartsSucceeded(response.carts));
}

function* handleAddToCart(action: Action<AddCartItemPayload>) {
  try {
    const item = action.payload;
    const { isLoggedIn, carts } = yield select((store: StoreState) => ({
      isLoggedIn: !!store.authenticate.token,
      carts: store.checkout.cart.carts,
    }));

    if (carts?.length > 0) {
      const listFilterDiffBBBBikeInCardList = carts.filter((it: CartModel) => !it?.seller_is_bbb);

      if (listFilterDiffBBBBikeInCardList.length > 0) {
        if (
          carts.find(
            (it: CartModel) =>
              it.seller_id !== action.payload.seller_id &&
              it.storefront_id !== action.payload.storefront_id &&
              !action.payload.sellerIsBBB,
          )
        ) {
          throw 'You can only buy bikes from one seller';
        }
      }
    }

    if (isLoggedIn) {
      const i = { ...item, cart_type: 'manual' };
      yield call(addToCart, i);
    } else {
      const cartStorageItem: CartStorageItem = { ...item, cart_type: 'manual' };
      cartStorageService.addToCart(cartStorageItem);
    }
    const response: CartResponse = yield handleGetCartWithCurrentShippingAndCoupon();
    yield put(cartAction.addCartItemSucceeded(response.carts, item.master_listing_id));
    addTag({
      event: 'checkout',
      ecommerce: {
        checkout: {
          products: carts.map((cart: CartModel) => ({
            id: cart._id,
            price: cart.current_listed_price || 0,
            quantity: cart.quantity,
          })),
        },
      },
    });
    Router.push(
      {
        pathname: Router.pathname,
        query: {
          ...Router.query,
          backOnClose: true,
          cart: true,
        },
      },
      '/cart',
      { shallow: true },
    );
  } catch (e) {
    yield put(cartAction.addCartItemFailed(action.payload, getMessageFromError(e)));
    toastError(e);
  }
}

function* handleGetCarts() {
  try {
    // const isLoggedIn = yield select((store: StoreState) => !!store.authenticate.token);
    const response: CartResponse = yield handleGetCartWithCurrentShippingAndCoupon();
    if (response.message) {
      toastSuccess(response.message);
    }
    yield put(cartAction.getCartsSucceeded(response.carts));
  } catch (e) {
    yield put(cartAction.getCartsFailed(getMessageFromError(e)));
    toastError(e);
  }
}

function* handleRemoveCart(action: Action<ModifyCartItemPayload>) {
  try {
    const isLoggedIn = yield select((store: StoreState) => !!store.authenticate.token);
    if (isLoggedIn) {
      yield call(removeFromCart, action.payload._id);
    } else {
      cartStorageService.removeCart(action.payload.master_listing_id, action.payload.frame_size);
    }
    const response: CartResponse = yield handleGetCartWithCurrentShippingAndCoupon();
    yield put(cartAction.removeCartItemSucceeded(response.carts));
    toastSuccess(t('cart.itemRemoved'), t('seoTitle.success'));
  } catch (e) {
    yield put(cartAction.removeCartItemFailed(getMessageFromError(e)));
    toastError(e);
  }
}

function* handleChangeQtyCart(action: ActionMeta<ModifyCartItemPayload, ChangeQuantityType>) {
  try {
    const isLoggedIn = yield select((store: StoreState) => !!store.authenticate.token);
    if (isLoggedIn) {
      yield call(changeQuantity, action.payload._id, action.meta);
    } else {
      cartStorageService.changeQuantity(action.payload.master_listing_id, action.payload.frame_size, action.meta);
    }
    const response: CartResponse = yield handleGetCartWithCurrentShippingAndCoupon();
    yield put(cartAction.changeQtyCartItemSucceeded(response.carts, action.payload.master_listing_id));
  } catch (e) {
    yield put(cartAction.changeQtyCartItemFailed(getMessageFromError(e)));
    toastError(e);
  }
}

function* handleChangeLocalPickupCart(action: Action<ChangeLocalPickUpItemPayload>) {
  try {
    const isLoggedIn = yield select((store: StoreState) => !!store.authenticate.token);
    if (isLoggedIn) {
      yield call(changeLocalPickup, action.payload._id, action.payload.local_pickup);
    } else {
      cartStorageService.changeLocalPickup(
        action.payload.master_listing_id,
        action.payload.frame_size,
        action.payload.local_pickup,
      );
    }
    const response: CartResponse = yield handleGetCartWithCurrentShippingAndCoupon();
    yield put(cartAction.changeLocalPickupCartItemSucceeded(response.carts, action.payload.master_listing_id));
  } catch (e) {
    yield put(cartAction.changeLocalPickupCartItemFailed(getMessageFromError(e)));
    toastError(e);
  }
}

function* handleSyncCart() {
  try {
    const isLoggedIn = yield select((store: StoreState) => !!store.authenticate.token);
    const isStoreFront = yield select((store: StoreState) => !!store.authenticate.user?.storefront);
    const isPartner = yield select((store: StoreState) => !!store.authenticate.user?.partner);
    if (isLoggedIn) {
      const cartLocal: CartStorageItem[] = cartStorageService.get();
      if ((isStoreFront || isPartner) && cartLocal.length > 0) {
        cartStorageService.clear();
        toastSuccess(
          t('cart.cartRemoved', {
            role: isStoreFront ? 'store front' : 'partner',
          }),
        );
      } else if (cartLocal.length > 0) {
        const response: CartResponse = yield call(addMultiple, cartLocal);
        yield put(cartAction.syncCartItemsSucceeded(response.carts));
        if (response.message) {
          toastSuccess(`Sync cart successfully but: ${lowerCase(response.message)}`);
        }
      } else {
        yield put(cartAction.getCarts());
      }
      cartStorageService.clear();
    }
  } catch (e) {
    yield put(cartAction.syncCartItemsFailed(getMessageFromError(e)));
    toastError(e);
  }
}

function* handleApplyCouponCode(action: Action<string>) {
  try {
    const response: CartResponse = yield call(handleGetCartWithCurrentShippingAndCoupon, undefined, action.payload);
    if (response.message) {
      toastSuccess(response.message);
    }
    yield put(cartAction.applyCouponCodeSucceeded(response.carts, action.payload));
  } catch (e) {
    yield put(cartAction.applyCouponCodeFailed(getMessageFromError(e)));
  }
}

function* syncShipping(shipping: AddShippingBody) {
  try {
    yield call(addShipping, shipping);
    const shippingResponse: GetShippingResponse = yield call(getShipping);
    yield put(shippingAction.getShippingSucceeded(shippingResponse));
    if (shippingResponse?.data && shippingResponse.data[0]) {
      yield put(cartAction.saveCheckoutShipping(shippingResponse.data[0]));
    }
  } catch (e) {
    // eslint-disable-next-line no-throw-literal
    throw 'Cannot sync your shipping address, please add it manually';
  }
}

function* syncCart() {
  yield put(cartAction.syncCartItems());
  const result = yield race({
    success: take(cartAction.syncCartItemsSucceeded),
    error: take(cartAction.syncCartItemsFailed),
  });
  if (result.error) {
    // eslint-disable-next-line no-throw-literal
    throw 'cannot sync cart item, please add your item back manually';
  }
}

function* handleCreateCustomerOnCheckout(action: Action<CreateAccountOnCheckoutPayload>) {
  try {
    const { shipping, customer, sessionId } = action.payload;
    const body: RegisterPersonalModel = {
      email: customer.email,
      user_name: customer.username,
      password: customer.password,
      confirm_password: customer.password,
      first_name: customer.firstName,
      last_name: customer.lastName,
      country: 'US',
      zip_code: shipping?.postal_code,
      phone: shipping?.phone,
      address: shipping?.line1,
      city: shipping?.city,
      state: shipping?.state,
      token_captcha: customer.captcha,
      os_type: 'web',
      is_setting: customer.subscription,
      session_id: sessionId,
    };
    yield put(cartAction.changeStatusCreateAccount('Creating Your Account'));
    yield put(cartAction.changeCreateGuestStatus('waiting'));
    const response = yield call(registerPersonal, body);
    CookieBrowser.set(V3_TOKEN_KEY, response.token, COOKIE_OPTION);
    CookieBrowser.set(V3_USER_KEY, response, COOKIE_OPTION);
    authorizedRequest.setToken(response.token);
    yield put(authenticateActions.loginSucceeded(response));
    toastSuccess(`Create account successfully`);
  } catch (e) {
    toastError(`Cannot create your account: ${getMessageFromError(e)}`);
    yield put(cartAction.changeStatusCreateAccount(''));
    yield put(cartAction.changeCreateGuestStatus('failed'));
    return;
  }
  try {
    yield put(cartAction.changeStatusCreateAccount('Syncing your cart and shipping address'));
    const syncActionObj: { syncCartSuccess: CallEffect<void>; syncShipping?: CallEffect<void> } = {
      syncCartSuccess: call(syncCart),
    };
    if (action.payload.shipping) {
      syncActionObj.syncShipping = call(syncShipping, action.payload.shipping);
    }
    yield all(syncActionObj);
    yield put(cartAction.changeStatusCreateAccount(''));
    yield put(cartAction.changeCreateGuestStatus('success'));
  } catch (e) {
    yield put(cartAction.changeStatusCreateAccount(''));
    yield put(cartAction.changeCreateGuestStatus('failed'));
    toastError(e);
  }
}

export default function* cartSaga() {
  yield takeLeading(cartAction.addToCart, handleAddToCart);
  yield takeLeading(cartAction.getCarts, handleGetCarts);
  yield takeLeading(cartAction.removeFromCart, handleRemoveCart);
  yield takeLeading(cartAction.changeQtyCartItem, handleChangeQtyCart);
  yield takeLeading(cartAction.changeLocalPickupCartItem, handleChangeLocalPickupCart);
  yield takeLeading(cartAction.syncCartItems, handleSyncCart);
  yield takeLeading(cartAction.applyCouponCode, handleApplyCouponCode);
  yield takeLeading(cartAction.createCustomerOnCheckout, handleCreateCustomerOnCheckout);
}
