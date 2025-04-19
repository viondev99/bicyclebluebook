import { DataList } from '../../../common';

export type OrderListingResponse = DataList<OrderModel>;

export interface OrderModel {
  amount: AmountModel;
  order_code: string;
  user_type: string;
  seller: string[];
  storefronts: any[];
  e_check: boolean;
  status: string;
  stage: string;
  _id: string;
  user: string;
  billing_address?: IngAddress;
  date_created: string;
  date_updated: string;
  increase: number;
  line_item: LineItemModel[];
  shipping_address?: IngAddress;
  date_finish: string;
  payment_id: string;
  is_transaction: boolean;
  payment_method: string;
  profile_temp: string;
  report_buyer_id: string;
  customer_name: string;
}

export interface AmountModel {
  details: OrderDetailModel;
  currency: string;
  total: number;
}

export interface OrderDetailModel {
  subtotal: number;
  tax: number;
  shipping: number;
  insurance: number;
}

export interface IngAddress {
  recipient_name: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

export interface LineItemModel {
  is_buyer_return: boolean;
  amount_refund: number;
  stage_pay: string;
  quantity: number;
  frame_size: string;
  market_listing_ids: number[];
  inventory_ids: number[];
  is_calculate_ship_failed: boolean;
  frame_sizes: any[];
  market_listings: MarketListingModel[];
  images: string[];
  cart_type: string;
  seller_id: string;
  currency: string;
  inventory_id: number;
  allow_local_pickup: boolean;
  bicycle_brand_name: string;
  bicycle_id: number;
  bicycle_model_name: string;
  bicycle_name: string;
  bicycle_type_name: string;
  bicycle_year_name: number;
  bicycle_size_name: string;
  brake_name: string;
  brand_id: number;
  condition: string;
  current_listed_price: number;
  discounted_price: number;
  frame_material_name: string;
  image_default: string;
  initial_list_price: number;
  location: Location;
  model_id: number;
  msrp_price?: number;
  name: string;
  stage: string;
  status: string;
  title: string;
  year_id: number;
  zip_code: string;
  country_name: string;
  country_code: string;
  state_name: string;
  state_code: string;
  county: string;
  city_name: string;
  buyer_id: string;
  market_listing_id: number;
  shipping: number;
  insurance: number;
  tax: number;
  local_pickup: boolean;
  date_created: string;
  date_updated: string;
  master_listing_id: number;
  fix_insurance: number;
  fix_shipping: number;
  fix_subtotal: number;
  fix_tax: number;
  subtotal: number;
  insurance_market?: boolean;
  shipping_type?: string;
  flat_rate?: number;
}

export interface MarketListingModel {
  inventory_id: number;
  inventory_name: string;
  market_listing_id: number;
}

export interface GetOrdersQuery {
  page?: number;
  sort?: string;
  page_size?: number;
}

export interface SellerInfoResponse {
  _id: string;
  email: string;
  display_name: string;
  gravatar: string;
  avatar: string;
}

export interface OrderDetailResponse {
  amount: AmountModel;
  order_code: string;
  user_type: string;
  seller: string[];
  storefronts: string[];
  e_check: boolean;
  status: string;
  stage: string;
  _id: string;
  user: string;
  customer_name: string;
  date_created: string;
  date_updated: string;
  discount: number;
  increase: number;
  line_item: LineItemModel[];
  receipt_id: string;
  report_buyer_id: string;
  payment_method: string;
  date_finish: string;
  paypal: Paypal;
  shipping_address?: {
    city: string;
    line1: string;
    phone: string;
    postal_code: string;
    recipient_name: string;
    state: string;
  };
}

export interface Paypal {
  payment_info: null;
}

export interface RefundRequest {
  reason: string;
  otherReason?: string;
  note: string;
  carrier?: string;
  otherCarrier?: string;
  order_id: string;
  trackingNumber?: string;
  master_listing_id: number;
  market_listing_id: number;
  inventory_id: number;
  tracking_id?: string;
}

export interface RefundOrderResponse {
  message: string;
}

export interface ReturnDetailRequest {
  inventory_id: number;
  market_listing_id: number;
  master_listing_id: number;
  order_id: string;
}

export interface ReturnDetailResponse {
  user_type: string;
  _id: string;
  buyer: string;
  inventory: number;
  market_listing: number;
  master_listing: number;
  order: string;
  seller: string;
  carrier: string;
  date_created: Date;
  date_updated: Date;
  image: string;
  insurance: number;
  note_to_seller: string;
  price: number;
  quantity: number;
  reason_buyer_return: string;
  request_code: string;
  return_status: string;
  shipping: number;
  shipping_payer: string;
  storefront: string;
  subtotal: number;
  tax: number;
  tracking_id: string;
}

export interface AmountRefund {
  inventory_id: number;
  amount: number;
}

export interface RefundRequestFromBuyer {
  order_id: string;
  reason: string;
  amounts: AmountRefund[];
  refundBy?: string;
}

export interface OpenCaseForBuyerBody {
  order_id: string;
  reason_case: {
    description: string;
    reason: string;
  };
}
