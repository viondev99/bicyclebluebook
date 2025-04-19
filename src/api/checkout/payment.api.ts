/* eslint-disable no-param-reassign */
import authorizedRequest from 'helpers/request/authorizedRequest';
import unauthorizedRequest from 'helpers/request/unauthorizedRequest';
import { CreatePaymentIntentNewLogicResponse } from 'model/store/cart.model';
import { CreateStripePaymentByGoogleApplePayParams } from 'store/checkout/payment/payment.action';
import { OrderItem } from './cart.api';
import {
  ConfirmPaymentGoogleApplePayGuestRequest,
  ConfirmPaymentGoogleApplePayRequestParams,
  ResponseOrderV2,
} from './paymentGoogleApplePay.api';

export interface ShippingAddress {
  recipient_name?: string;
  line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  apartment?: string;
}

export interface Customer {
  email: string;
  first_name: string;
  last_name: string;
}

export interface BillingAddress {
  recipient_name?: string;
  line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  apartment?: string;
}

export interface CreateOrderBody {
  shipping_address?: ShippingAddress;
  billing_address?: BillingAddress;
  gift_card_amount?: number;
  coupon_code?: string;
  payment_method?: string;
}

export interface CreateOrderGuestBody extends CreateOrderBody {
  customer: Customer;
  order_items: OrderItem[];
  shipping_address?: ShippingAddress;
  billing_address?: BillingAddress;
  gift_card_amount?: number;
  coupon_code?: string;
  payment_method?: string;
}

export interface Details {
  subtotal: number;
  tax: number;
  shipping: number;
  insurance: number;
}

export interface Amount {
  total: number;
  currency: string;
  details: Details;
}

export interface LineItem {
  inventory_id: number;
  bicycle_brand_name: string;
  bicycle_id: number;
  bicycle_model_name: string;
  bicycle_name: string;
  bicycle_type_name: string;
  bicycle_year_name: string;
  brake_name: string;
  brand_id: number;
  condition: string;
  current_listed_price: number;
  discounted_price: number;
  frame_material_name: string;
  images: string[];
  image_default: string;
  initial_list_price: number;
  model_id: number;
  name: string;
  stage: string;
  status: string;
  title: string;
  year_id: string;
  market_listing_id: number;
  cart_type: string;
  seller_id: string;
  storefront_id: string;
  buyer_id: string;
  quantity: number;
  currency: string;
  shipping: number;
  insurance: number;
  tax: number;
  local_pickup: boolean;
}

export interface CreateOrderResponse {
  user: string;
  customer: string;
  report_buyer_id: string;
  amount: Amount;
  order_code: string;
  seller: string[];
  storefronts: string[];
  status: string;
  stage: string;
  line_item: LineItem[];
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  payment_id: string;
  increase: number;
  date_created: string;
  date_updated: string;
  requiresAction: string;
  clientSecret: string;
  _id: string;
  session_id?: string;
}

export interface CreatePaypalPaymentResponse {
  payment_method: string;
  order_id: string;
  link: string;
}

export interface CreateStripePaymentBody {
  token: string;
  coupon_code?: string;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  gift_card_amount?: number;
}

export interface CreateStripePaymentGuestBody extends CreateStripePaymentBody {
  customer: Customer;
  order_items: OrderItem[];
}

export interface CompletePaymentBody {
  order_id: string;
  payment_id: string;
  payer_id: string;
}

export interface GetDetailGiftCardParams {
  customer: string;
  need_more: string;
}

export interface GiftCardValueCard {
  price: number;
  balance: number;
}

export interface GiftCardBillingAddress {
  country_code: string;
}

export interface GiftCardCustomer {
  billing_address: GiftCardBillingAddress;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id: string;
}

export interface GetDetailGiftCardResponse {
  value_card: GiftCardValueCard;
  customer: GiftCardCustomer;
  status: boolean;
  is_deleted: boolean;
  _id: string;
  date_created: Date;
  date_updated: Date;
  coupon_code: string;
  giftcard_code: string;
  gift_card_value: number;
  gift_card_status: boolean;
  gift_card_online_store_id: string;
  discountValue?: string | number;
  isHideModal?: boolean;
}

export interface CreatePaymentIntentNewLogic {
  order_id: string;
  email: string;
  shipping_address: {
    recipient_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  };
}

export interface CreateOrderBodyParams {
  all_pm: boolean;
}

export function createOrder(data: CreateOrderBody, params?: CreateOrderBodyParams) {
  return authorizedRequest.post<CreateOrderResponse>('/billing/api/v1/order', data, {
    params,
  });
}

export function createOrderGuest(data: CreateOrderGuestBody) {
  return unauthorizedRequest.post<CreateOrderResponse>('/billing/api/v1/order/guest-create', data);
}

export function createPaymentWithPaypal(orderId: string) {
  return authorizedRequest.post<CreatePaypalPaymentResponse>('/billing/api/v1/payment/paypal', { order_id: orderId });
}

export function createPaymentWithPaypalGuest(orderId: string) {
  return unauthorizedRequest.post<CreatePaypalPaymentResponse>('/billing/api/v1/payment/paypal-guest', {
    order_id: orderId,
  });
}

export function createPaymentWithStripe(data: CreateStripePaymentBody) {
  return authorizedRequest.post<CreateOrderResponse>('/billing/api/v1/payment/stripe/pay', data);
}

export function createPaymentWithStripeGuest(data: CreateStripePaymentGuestBody) {
  return unauthorizedRequest.post<CreateOrderResponse>('/billing/api/v1/payment/stripe/pay-with-guest', data);
}

export function generateTokenStripePaymentP2P() {
  return authorizedRequest.post<string>(`billing/api/v1/payment/stripe/generate-token`, {});
}

type CreateStripePaymentP2PBody = {
  order: string;
  token?: string;
  is_paypal: boolean;
  payment_intent_id?: string;
};

export function createPaymentWithStripeP2P(data: CreateStripePaymentP2PBody) {
  return authorizedRequest.post<CreateOrderResponse>('/billing/api/v1/payment/stripe/payment-intent', data);
}

export function completeOrder(data: CompletePaymentBody) {
  return authorizedRequest.put<CreateOrderResponse>('/billing/api/v1/payment/paypal/complete', data);
}

export function completeOrderGuest(data: CompletePaymentBody) {
  return authorizedRequest.put<CreateOrderResponse>('/billing/api/v1/payment/paypal-guest/complete', data);
}
interface VerifyStripeAccountBySellerIdBody {
  seller_id: string;
  is_storefront: boolean;
}

export function verifyStripeAccountBySellerId(payload: VerifyStripeAccountBySellerIdBody) {
  return authorizedRequest.post<boolean>('/billing/api/v1/payment/stripe/account/verify-by-seller-id', payload);
}

export function cancelOrder(id: string) {
  return authorizedRequest.put<boolean>(`/billing/api/v1/payment/paypal/cancel`, { order_id: id });
}

export function cancelOrderGuest(id: string) {
  return unauthorizedRequest.put<boolean>(`/billing/api/v1/payment/paypal/cancel`, { order_id: id });
}

export function createPaymentOrderV2Request(data: CreateStripePaymentByGoogleApplePayParams) {
  const payload = {
    billing_address: data?.billingAddress,
    shipping_address: data?.shippingAddress,
  };
  return authorizedRequest.post<ResponseOrderV2>('/billing/api/v1/order', payload);
}

export function confirmPaymentGoogleApplePayRequest(data: ConfirmPaymentGoogleApplePayRequestParams) {
  return authorizedRequest.post<void>('/billing/api/v1/payment/stripe/complete-order-v2', data);
}
export function confirmPaymentGoogleApplePayGuestRequest(data: ConfirmPaymentGoogleApplePayGuestRequest) {
  return authorizedRequest.post<void>('/billing/api/v1/payment/stripe/complete-order-guest-v2', data);
}

export function getDetailGiftCardRequest(params: GetDetailGiftCardParams) {
  return authorizedRequest.get<CreateOrderResponse>('/billing/api/v1/gift/detail/customer', {
    params,
  });
}

export function createPaymentIntentNewLogic(body: CreatePaymentIntentNewLogic) {
  return authorizedRequest.post<CreatePaymentIntentNewLogicResponse>(
    '/billing/api/v1/payment/stripe/create-payment-intent',
    body,
  );
}
