import { AddressModel } from 'model/api/store-front/order.model';
import { DataList } from '../../../common';

export type OrderListingModel = DataList<any>;

export interface ComplaintOrder {
  id: string;
  name: string;
  buyerName: string;
  content: string;
  dateCreated: string;
  reason_case?: {
    description: string;
    reason: string;
  };
  send_reponses?: object[];
}

export interface OrderStoreModel {
  listing: {
    error: string;
    loading: boolean;
    orders: DataList<OrderModel>;
  };
  detail: {
    error: string;
    loading: boolean;
    order: OrderDetailModel;
  };
  returnDetail: {
    loading: boolean;
    error: string;
    item: ReturnDetailModel;
  };
  complaint: {
    loading: boolean;
    error: string;
    list: Array<ComplaintOrder>;
  };
}

export interface OrderModel {
  amount: AmountModel;
  order_code: string;
  buyer_request_cancel: boolean;
  user_type: string;
  seller: string[];
  storefronts: string[];
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
  coupon?: {
    code?: string;
  };
}

export interface AmountModel {
  details: OrderAmountDetailModel;
  currency: string;
  total: number;
}

export interface OrderAmountDetailModel {
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

interface FrameSize {
  frame_size: string;
  total_for_sale: number;
  total_sale_pending: number;
  total_sold: number;
  all: number;
}

export interface LineItemModel {
  is_buyer_return: boolean;
  amount_refund: number;
  stage_pay: string;
  quantity: number;
  frame_size: string;
  offer_id: string;
  market_listing_ids: number[];
  inventory_ids: number[];
  is_calculate_ship_failed: boolean;
  return_within_days: number;
  frame_sizes: FrameSize[];
  market_listings: MarketListingModel[];
  images: string[];
  is_allow_return: boolean;
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
  return_shipping_payer?: string;
  seller_is_bbb?: boolean;
  storefront_id: string;
  reason_buyer_return?: string;
  _id: string;
  paypal_email_seller: string;
  is_free_ship: boolean;
  shipping_fee: string;
  shipping_profile_label: string;
  total_for_sale: number;
  type_id: number;
  type_inventory_name: string;
  discount: number;
  tracking_number?: string;
}

export interface MarketListingModel {
  inventory_id: number;
  inventory_name: string;
  market_listing_id: number;
  is_buyer_return?: boolean;
  amount_refund?: number;
  is_seller_refund?: boolean;
}

export interface SellerInfo {
  _id: string;
  email: string;
  display_name: string;
  gravatar: string;
  avatar: string;
}

export interface OrderDetailModel {
  amount: AmountModel;
  order_code: string;
  complain_order?: string;
  user_type: string;
  seller: string[];
  storefronts: string[];
  date_cancel: string;
  buyer_request_cancel?: boolean;
  buyer_reason_cancel?: string;
  seller_reason_cancel: string;
  seller_cancel: boolean;
  e_check: boolean;
  status: string;
  stage: string;
  _id: string;
  user: string;
  customer_name: string;
  date_created: Date;
  date_updated: Date;
  discount: number;
  increase: number;
  line_item: LineItemModel[];
  receipt_id: string;
  report_buyer_id: string;
  payment_method: string;
  payment_method_stripe?: string;
  date_finish: string;
  paypal: Paypal;
  is_bbb: boolean;
  coupon?: {
    code?: string;
  };
  billing_address: AddressModel;
  shipping_address?: {
    apartment?: string;
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

export interface ReturnDetailModel {
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
  reason_seller_return?: string;
  note_to_buyer?: string;
  amount_refund: number;
  date_delivered?: string;
  shipping_label?: string;
}
