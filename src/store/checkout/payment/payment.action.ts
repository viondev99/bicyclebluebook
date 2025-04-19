import { createActions } from 'redux-actions';
import {
  BillingAddress,
  Customer,
  GetDetailGiftCardParams,
  GetDetailGiftCardResponse,
  ShippingAddress,
} from 'api/checkout/payment.api';
import { OrderItem } from 'api/checkout/cart.api';
import { CreatePaymentIntentNewLogicResponse } from 'model/store/cart.model';
import { string } from 'yup';

export interface CreatePaypalPaymentPayload {
  shipping_address?: ShippingAddress;
  billing_address?: BillingAddress;
  customer?: Customer;
  order_items?: OrderItem[];
}

export interface CreateStripePaymentPayload extends CreatePaypalPaymentPayload {
  coupon_code?: string;
  token: string;
  gift_card_amount?: number;
}

export interface CreateStripePaymentP2PPayload {
  shipping_address?: ShippingAddress;
  billing_address?: BillingAddress;
  customer?: Customer;
  token: string;
  order_items?: OrderItem[];
}

export interface CreateStripePaymentFailPayload {}

export interface ConfirmStripePaymentPayload {
  paymentIntentId: string;
  orderId: string;
}

export interface CreateStripePaymentByGoogleApplePayParams {
  methodName?: string;
  paymentMethodId: string;
  billingAddress: BillingAddress | undefined;
  shippingAddress: ShippingAddress | undefined;
  paymentRequestResponseData?: any;
  customer?: Customer;
  order_items?: OrderItem[];
  gift_card_amount?: number;
  coupon_code?: string;
  payment_method: string;
}

export interface SetBillingAddressAndOrderId {
  billing_address: {
    recipient_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  };
  orderId: string;
}

export type PaymentPayload =
  | ConfirmStripePaymentPayload
  | CreatePaypalPaymentPayload
  | CreateStripePaymentPayload
  | CreateStripePaymentP2PPayload
  | CreateStripePaymentFailPayload
  | GetDetailGiftCardParams
  | GetDetailGiftCardResponse
  | SetBillingAddressAndOrderId;

const {
  createPaypalPayment,
  createPaypalPaymentSucceeded,
  createPaypalPaymentFailed,
  createStripePayment,
  createStripePaymentSucceeded,
  createStripePaymentFailed,
  createStripePaymentP2p,
  createStripePaymentP2pSucceeded,
  createStripePaymentP2pFailed,
  confirmStripePayment,
  confirmStripePaymentSucceeded,
  confirmStripePaymentFailed,
  confirmStripePaymentP2p,
  confirmStripePaymentP2pSucceeded,
  confirmStripePaymentP2pFailed,
  setCheckoutSuccessId,
  createStripePaymentByGoogleApplePay,
  createStripePaymentByGoogleApplePaySucceeded,
  createStripePaymentByGoogleApplePayFailed,
  getDetailGiftCard,
  getDetailGiftCardSucceeded,
  getDetailGiftCardFailed,
  setDetailGiftCard,
  setDataPaymentIntent,
  setBillingAddressAndOrderId,
} = createActions<PaymentPayload>({
  CREATE_PAYPAL_PAYMENT: (payload: CreatePaypalPaymentPayload) => payload,
  CREATE_PAYPAL_PAYMENT_SUCCEEDED: null,
  CREATE_PAYPAL_PAYMENT_FAILED: null,
  CREATE_STRIPE_PAYMENT: (payload: CreateStripePaymentPayload) => payload,
  CREATE_STRIPE_PAYMENT_SUCCEEDED: null,
  CREATE_STRIPE_PAYMENT_FAILED: null,
  CREATE_STRIPE_PAYMENT_P2P: (payload: CreateStripePaymentP2PPayload) => payload,
  CREATE_STRIPE_PAYMENT_P2P_SUCCEEDED: null,
  CREATE_STRIPE_PAYMENT_P2P_FAILED: (payload: CreateStripePaymentFailPayload) => payload,
  CONFIRM_STRIPE_PAYMENT: (payload: ConfirmStripePaymentPayload) => payload,
  CONFIRM_STRIPE_PAYMENT_SUCCEEDED: null,
  CONFIRM_STRIPE_PAYMENT_FAILED: null,
  CONFIRM_STRIPE_PAYMENT_P2P: (payload: ConfirmStripePaymentPayload) => payload,
  CONFIRM_STRIPE_PAYMENT_P2P_SUCCEEDED: null,
  CONFIRM_STRIPE_PAYMENT_P2P_FAILED: null,
  SET_CHECKOUT_SUCCESS_ID: (payload: string) => payload,
  CREATE_STRIPE_PAYMENT_BY_GOOGLE_APPLE_PAY: (payload: CreateStripePaymentByGoogleApplePayParams) => payload,
  CREATE_STRIPE_PAYMENT_BY_GOOGLE_APPLE_PAY_SUCCEEDED: null,
  CREATE_STRIPE_PAYMENT_BY_GOOGLE_APPLE_PAY_FAILED: null,
  GET_DETAIL_GIFT_CARD: (payload: GetDetailGiftCardParams) => payload,
  GET_DETAIL_GIFT_CARD_SUCCEEDED: (payload: GetDetailGiftCardResponse) => payload,
  GET_DETAIL_GIFT_CARD_FAILED: null,
  SET_DETAIL_GIFT_CARD: (payload: GetDetailGiftCardResponse) => payload,
  SET_DATA_PAYMENT_INTENT: (payload: CreatePaymentIntentNewLogicResponse) => payload,
  SET_BILLING_ADDRESS_AND_ORDER_ID: (payload: SetBillingAddressAndOrderId) => payload,
});

export default {
  createPaypalPayment,
  createPaypalPaymentSucceeded,
  createPaypalPaymentFailed,
  createStripePayment,
  createStripePaymentSucceeded,
  createStripePaymentFailed,
  createStripePaymentP2p,
  createStripePaymentP2pSucceeded,
  createStripePaymentP2pFailed,
  confirmStripePayment,
  confirmStripePaymentSucceeded,
  confirmStripePaymentFailed,
  confirmStripePaymentP2p,
  confirmStripePaymentP2pSucceeded,
  confirmStripePaymentP2pFailed,
  setCheckoutSuccessId,
  createStripePaymentByGoogleApplePay,
  createStripePaymentByGoogleApplePaySucceeded,
  createStripePaymentByGoogleApplePayFailed,
  getDetailGiftCard,
  getDetailGiftCardSucceeded,
  getDetailGiftCardFailed,
  setDetailGiftCard,
  setDataPaymentIntent,
  setBillingAddressAndOrderId,
};
