import authorizedRequest from 'helpers/request/authorizedRequest';

export interface CalculateShipmentFeeRequest {
  fromCity?: string;
  fromCountryCode: string;
  fromLine?: string;
  fromStateCode?: string;
  fromZipCode: string;
  height: string;
  length: string;
  shippingServiceId?: string;
  toCity?: string;
  toCountryCode?: string;
  toLine?: string;
  toStateCode?: string;
  toZipCode?: string;
  weight: string;
  width: string;
}

export interface CalculateShipmentFee {
  totalCharge: number;
  toZipCode: string;
}

export function calculateShipmentFee(params: CalculateShipmentFeeRequest) {
  return authorizedRequest.get<CalculateShipmentFee[]>('shipment/api/shipment/outbound/fee', { params });
}

export interface GetShippingCostParams {
  toCountryCode: string;
  toZipCode: string;
  toStateCode?: string;
  toCity?: string;
  toLine?: string;
}

export function getShippingCost(masterListingId: string, params: GetShippingCostParams) {
  return authorizedRequest.get<CalculateShipmentFee>(
    `shipment/api/masterListing/${masterListingId}/shipment/outbound/fee`,
    {
      params,
    },
  );
}

export interface PrintShippingLabelBody {
  length: number;
  width: number;
  height: number;
  weight: number;
  addressLine: string;
  cityName: string;
  state: string;
  zipCode: string;
  country: string;
}

export function printShippingLabel(masterListingId: string, body: PrintShippingLabelBody) {
  return authorizedRequest.put(`core/api/marketListing/PTP/packageShipping/${masterListingId}`, body);
}

export interface PayWithStripeBody {
  token: string;
  order_id: string;
  master_listing_id: string;
  shipping_fee: number;
  shipping_address: {
    recipient_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  };
}

export function payWithStripe(body: PayWithStripeBody) {
  return authorizedRequest.post(`billing/api/v1/payment/stripe/pay-shipping-fee`, body);
}

export interface PayWithPaypalBody {
  order_id: string;
  master_listing_id: string;
  shipping_fee: number;
  shipping_address: {
    recipient_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  };
}

export function payWithPaypal(body: PayWithPaypalBody) {
  return authorizedRequest.post(`billing/api/v1/payment/paypal/shipping-fee`, body);
}

export interface CompletePayWithPaypalBody {
  order_id: string;
  master_listing_id: string;
  payment_id: string;
  payer_id: string;
}

export function completePayWithPaypal(body: CompletePayWithPaypalBody) {
  return authorizedRequest.put('billing/api/v1/payment/paypal/shipping-fee/complete', body);
}

export interface CancelPayWithPaypalBody {
  order_id: string;
  master_listing_id: string;
}

export function cancelPayWithPaypal(body: CancelPayWithPaypalBody) {
  return authorizedRequest.put('billing/api/v1/payment/paypal/shipping-fee/cancel', body);
}
