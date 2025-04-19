/* eslint-disable no-unused-expressions */
import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import Router from 'next/router';
import StoreState from 'model/store';
import {
  createOrder,
  createOrderGuest,
  createPaymentWithPaypal,
  createPaymentWithPaypalGuest,
  createPaymentWithStripe,
  createPaymentWithStripeGuest,
  // generateTokenStripePaymentP2P,
  createPaymentWithStripeP2P,
  CreateOrderBody,
  CreateOrderGuestBody,
  CreateOrderResponse,
  CreatePaypalPaymentResponse,
  CreateStripePaymentBody,
  CreateStripePaymentGuestBody,
  createPaymentOrderV2Request,
  confirmPaymentGoogleApplePayRequest,
  GetDetailGiftCardParams,
  getDetailGiftCardRequest,
  GetDetailGiftCardResponse,
  confirmPaymentGoogleApplePayGuestRequest,
} from 'api/checkout/payment.api';
import { toastError } from 'helpers/utils.helper';
import {
  ConfirmPaymentGoogleApplePayGuestRequest,
  ConfirmPaymentGoogleApplePayRequestParams,
  ResponseOrderV2,
} from 'api/checkout/paymentGoogleApplePay.api';
import { kountConfigEnv } from 'helpers/utilities.helper';
import { handleClickReactGA } from 'helpers/constraint.helper';
import { triggerGA4Purchase } from 'helpers/ga4.helper';
import cartActions from '../cart/cart.action';
import paymentAction, {
  CreatePaypalPaymentPayload,
  CreateStripePaymentPayload,
  CreateStripePaymentP2PPayload,
  ConfirmStripePaymentPayload,
  CreateStripePaymentByGoogleApplePayParams,
} from './payment.action';

function* handlePayWithPaypal(action: Action<CreatePaypalPaymentPayload>) {
  try {
    const isAuthenticated = yield select((state: StoreState) => !!state.authenticate.token);
    if (isAuthenticated) {
      const data: CreateOrderBody = {
        billing_address: action.payload.billing_address,
        shipping_address: action.payload.shipping_address,
      };
      const response: CreateOrderResponse = yield call(createOrder, data);
      if (response?.session_id !== undefined) {
        import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
          kountSDK(kountConfigEnv(), response?.session_id);
        });
      }
      const createPaymentResponse: CreatePaypalPaymentResponse = yield call(createPaymentWithPaypal, response._id);
      yield put(paymentAction.createPaypalPaymentSucceeded());
      yield put(cartActions.getCarts());
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(response._id);
      window.location.href = createPaymentResponse.link;
    } else {
      const data: CreateOrderGuestBody = {
        billing_address: action.payload.billing_address,
        shipping_address: action.payload.shipping_address,
        customer: action.payload.customer,
        order_items: action.payload.order_items,
      };
      const response: CreateOrderResponse = yield call(createOrderGuest, data);
      if (response?.session_id !== undefined) {
        import('@kount/kount-web-client-sdk').then(({ default: kountSDK }) => {
          kountSDK(kountConfigEnv(), response?.session_id);
        });
      }
      const createPaymentResponse: CreatePaypalPaymentResponse = yield call(createPaymentWithPaypalGuest, response._id);
      yield put(paymentAction.createPaypalPaymentSucceeded());
      yield put(cartActions.getCarts());
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(response._id);
      window.location.href = createPaymentResponse.link;
    }
  } catch (e) {
    yield put(paymentAction.createPaypalPaymentFailed());
    yield put(cartActions.getCarts());
    toastError(e);
  }
}

function* handlePayWithStripe(action: Action<CreateStripePaymentPayload>) {
  try {
    const isAuthenticated = yield select((state: StoreState) => !!state.authenticate.token);
    if (isAuthenticated) {
      let data: CreateStripePaymentBody = {
        billing_address: action.payload.billing_address,
        coupon_code: action.payload.coupon_code,
        shipping_address: action.payload.shipping_address,
        token: action.payload.token,
      };
      if (action.payload.gift_card_amount) {
        data = {
          ...data,
          gift_card_amount: action.payload.gift_card_amount,
        };
      }
      const response: CreateOrderResponse = yield call(createPaymentWithStripe, data);
      yield put(paymentAction.createStripePaymentSucceeded());
      yield put(cartActions.getCarts());
      yield put(paymentAction.setCheckoutSuccessId(response._id));
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(response._id);
      Router.push(`/checkout/success`);
    } else {
      const data: CreateStripePaymentGuestBody = {
        billing_address: action.payload.billing_address,
        coupon_code: action.payload.coupon_code,
        shipping_address: action.payload.shipping_address,
        token: action.payload.token,
        customer: action.payload.customer,
        order_items: action.payload.order_items,
      };
      const response: CreateOrderResponse = yield call(createPaymentWithStripeGuest, data);
      yield put(paymentAction.createStripePaymentSucceeded());
      yield put(cartActions.getCarts());
      yield put(paymentAction.setCheckoutSuccessId(response._id));
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(response._id);
      Router.push(`/checkout/success`);
    }
  } catch (e) {
    yield put(paymentAction.createStripePaymentFailed());
    yield put(cartActions.getCarts());
    toastError(e);
  }
}

function* createStripePaymentByGoogleApplePaySaga(action: Action<CreateStripePaymentByGoogleApplePayParams>) {
  try {
    const isAuthenticated = yield select((state: StoreState) => !!state.authenticate.token);
    let dataGiftCardAmout = {};
    if (action.payload.gift_card_amount) {
      dataGiftCardAmout = {
        ...dataGiftCardAmout,
        gift_card_amount: action.payload.gift_card_amount,
      };
    }
    if (isAuthenticated) {
      let data: CreateOrderBody = {
        billing_address: action.payload.billingAddress,
        shipping_address: action.payload.shippingAddress,
        coupon_code: action.payload.coupon_code,
        payment_method: action.payload.payment_method,
      };
      data = {
        ...data,
        ...dataGiftCardAmout,
      };

      const responseOrder: CreateOrderResponse = yield call(createOrder, data);
      const confirmPaymentGoogleApplePayRequestParams: ConfirmPaymentGoogleApplePayRequestParams = {
        order_id: responseOrder?._id,
        payment_method_id: action.payload?.paymentMethodId,
        payment_method: action.payload.payment_method,
      };
      yield call(confirmPaymentGoogleApplePayRequest, confirmPaymentGoogleApplePayRequestParams);
      yield put(paymentAction.setCheckoutSuccessId(responseOrder._id));
      yield put(paymentAction.createStripePaymentByGoogleApplePaySucceeded());
      action.payload?.paymentRequestResponseData?.complete('success');
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(responseOrder._id);
      Router.push(`/checkout/success`);
    }
    if (!isAuthenticated && action.payload.customer && action.payload.order_items) {
      let data: CreateOrderGuestBody = {
        billing_address: action.payload.billingAddress,
        shipping_address: action.payload.shippingAddress,
        customer: action.payload.customer,
        order_items: action.payload.order_items,
        coupon_code: action.payload.coupon_code,
        payment_method: action.payload.payment_method,
      };
      data = {
        ...data,
        ...dataGiftCardAmout,
      };

      const responseOrder: CreateOrderResponse = yield call(createOrderGuest, data);
      const confirmPaymentGoogleApplePayRequestParams: ConfirmPaymentGoogleApplePayGuestRequest = {
        order_id: responseOrder?._id,
        payment_method_id: action.payload?.paymentMethodId,
        payment_method: action.payload.payment_method,
        customer_email: action.payload?.customer?.email,
      };
      yield call(confirmPaymentGoogleApplePayGuestRequest, confirmPaymentGoogleApplePayRequestParams);
      yield put(paymentAction.setCheckoutSuccessId(responseOrder._id));
      yield put(paymentAction.createStripePaymentByGoogleApplePaySucceeded());
      action.payload?.paymentRequestResponseData?.complete('success');
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(responseOrder._id);
      Router.push(`/checkout/success`);
    }
  } catch (e) {
    yield put(paymentAction.createStripePaymentByGoogleApplePayFailed());
    yield put(cartActions.getCarts());
    toastError(e);
  }
}

function* handlePayWithStripeP2p(action: Action<CreateStripePaymentP2PPayload>) {
  try {
    const isAuthenticated = yield select((state: StoreState) => !!state.authenticate.token);
    const orderId = yield select((state: StoreState) => state.checkout.payment.checkoutSuccessId);

    const { token } = action.payload;
    if (isAuthenticated) {
      // const data: CreateOrderBody = {
      //   billing_address: action.payload.billing_address,
      //   shipping_address: action.payload.shipping_address,
      // };
      // const responseOrder: CreateOrderResponse = yield call(createOrder, data);
      // const token: string = yield call(generateTokenStripePaymentP2P);
      const responsePayment: CreateOrderResponse = yield call(createPaymentWithStripeP2P, {
        order: orderId,
        token,
        is_paypal: false,
      });
      if (responsePayment.requiresAction) {
        // Add client secret and order id to query without changing asPath
        yield put(paymentAction.createStripePaymentP2pFailed());
        return Router.replace(
          {
            query: { cs: responsePayment.clientSecret, od: orderId },
          },
          {},
        );
      }
      yield put(paymentAction.createStripePaymentP2pSucceeded());
      yield put(cartActions.getCarts());
      yield put(paymentAction.setCheckoutSuccessId(responsePayment._id));
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(orderId);
      Router.push(`/checkout/success`);
    } else {
      // const data: CreateOrderGuestBody = {
      //   billing_address: action.payload.billing_address,
      //   shipping_address: action.payload.shipping_address,
      //   customer: action.payload.customer,
      //   order_items: action.payload.order_items,
      // };
      // const responseOrder: CreateOrderResponse = yield call(createOrderGuest, data);
      // const token: string = yield call(generateTokenStripePaymentP2P);
      const responsePayment: CreateOrderResponse = yield call(createPaymentWithStripeP2P, {
        order: orderId,
        token,
        is_paypal: false,
      });
      if (responsePayment.requiresAction) {
        // Add client secret and order id to query without changing asPath
        yield put(paymentAction.createStripePaymentP2pFailed());
        return Router.replace(
          {
            query: { cs: responsePayment.clientSecret, od: orderId },
          },
          {},
        );
      }
      yield put(paymentAction.createStripePaymentP2pSucceeded());
      yield put(cartActions.getCarts());
      yield put(paymentAction.setCheckoutSuccessId(responsePayment._id));
      // handleClickReactGA('Complete payment', 'Complete payment', true);
      triggerGA4Purchase(orderId);
      Router.push(`/checkout/success`);
    }
  } catch (e) {
    yield put(paymentAction.createStripePaymentP2pFailed({}));
    yield put(cartActions.getCarts());
    toastError(e);
  }
}

export function* handleConfirmStripePaymentP2p(action: Action<ConfirmStripePaymentPayload>) {
  try {
    const responsePayment: CreateOrderResponse = yield call(createPaymentWithStripeP2P, {
      payment_intent_id: action.payload.paymentIntentId,
      order: action.payload.orderId,
      is_paypal: false,
    });
    yield put(paymentAction.confirmStripePaymentP2pSucceeded());
    yield put(paymentAction.setCheckoutSuccessId(responsePayment._id));
    // handleClickReactGA('Complete payment', 'Complete payment', true);
    triggerGA4Purchase(action.payload.orderId);
    Router.push(`/checkout/success`);
  } catch (e) {
    Router.replace(
      {
        query: {},
      },
      {},
    );
    yield put(paymentAction.confirmStripePaymentP2pFailed());
    toastError(e);
  }
  yield put(cartActions.getCarts());
}

export function* getDetailGiftCardSaga(action: Action<GetDetailGiftCardParams>) {
  try {
    const response: GetDetailGiftCardResponse = yield call(getDetailGiftCardRequest, action.payload);
    yield put(paymentAction.getDetailGiftCardSucceeded(response));
  } catch (e) {
    yield put(paymentAction.getDetailGiftCardFailed());
  }
  yield put(cartActions.getCarts());
}

export default function* paymentSaga() {
  yield takeLatest(paymentAction.createPaypalPayment, handlePayWithPaypal);
  yield takeLatest(paymentAction.createStripePayment, handlePayWithStripe);
  yield takeLatest(paymentAction.createStripePaymentP2p, handlePayWithStripeP2p);
  yield takeLatest(paymentAction.confirmStripePaymentP2p, handleConfirmStripePaymentP2p);
  yield takeLatest(paymentAction.createStripePaymentByGoogleApplePay, createStripePaymentByGoogleApplePaySaga);
  yield takeLatest(paymentAction.getDetailGiftCard, getDetailGiftCardSaga);
}
