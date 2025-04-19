import { CommonRequestQuery } from 'model/api/common.model';

export interface OrderModel {
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
  billing_address?: AddressModel;
  customer_name: string;
  date_created: Date;
  date_updated: Date;
  discount: number;
  increase: number;
  line_item: LineItemModel[];
  receipt_id: string;
  report_buyer_id: string;
  shipping_address?: AddressModel;
  payment_method: string;
  paypal: PaypalModel;
  date_finish: Date;
}

export interface AmountModel {
  total: number;
  currency: string;
  details: DetailModel;
}

export interface DetailModel {
  subtotal: number;
  tax: number;
  shipping: number;
  insurance: number;
}

export interface AddressModel {
  apartment?: string;
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
  frame_size: FrameSizeModel[];
  market_listing_ids: MarketListingModel[];
  inventory_ids: number[];
  is_calculate_ship_failed: boolean;
  frame_sizes: string[];
  market_listings: string[];
  _id: string;
  master_listing_id: number;
  seller_is_bbb: boolean;
  paypal_email_seller: string;
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
  location: string;
  model_id: number;
  name: string;
  is_free_ship: boolean;
  shipping_fee?: string;
  shipping_profile_label?: string;
  stage: string;
  status: string;
  title: string;
  total_for_sale?: number;
  type_id: number;
  type_inventory_name: string;
  year_id: number;
  zip_code: string;
  country_name: string;
  country_code: string;
  state_name: string;
  state_code: string;
  county: string;
  city_name: string;
  is_allow_return: boolean;
  return_shipping_payer: string;
  return_within_days: number;
  cart_type: string;
  seller_id: string;
  buyer_id: string;
  storefront_id: string;
  market_listing_id: number;
  currency: string;
  local_pickup: boolean;
  fix_shipping: number;
  fix_insurance: number;
  fix_tax: number;
  fix_subtotal: number;
  shipping: number;
  insurance: number;
  tax: number;
  subtotal: number;
  date_created: Date;
  date_updated: Date;
  discount: number;
  reason_buyer_return?: string;
  item_return_id?: string;
  shipping_type?: string;
  reason_seller_return?: string;
  bbb_value?: number;
  brake_type_id?: number;
  cogs_price?: number;
  frame_material_id?: number;
  msrp_price?: number;
  size_name?: string;
  type_inventory_id?: number;
  offer_id?: number;
  price_offer?: number;
}

export interface FrameSizeModel {
  _id: string;
  all: number;
  frame_size: string;
  total_for_sale: number;
  total_sold: number;
}

export interface MarketListingModel {
  market_listing_id: number;
  inventory_id: number;
  inventory_name: string;
  serial_number?: number;
  is_buyer_return?: boolean;
  is_seller_refund?: boolean;
}

export interface PaypalModel {
  response_envelope: ResponseEnvelopeModel;
  payment_info: PaymentInfoModel[];
  pay_key: string;
  payment_exec_status: string;
}

export interface PaymentInfoModel {
  _id: string;
  transaction_id: string;
  transaction_status: string;
  refunded_amount: string;
  pending_refund: string;
  sender_transaction_id: string;
  sender_transaction_status: string;
}

export interface ResponseEnvelopeModel {
  timestamp: Date;
  ack: string;
  correlation_id: string;
  build: string;
}

export interface GetOrdersQuery extends CommonRequestQuery {
  time_start?: number;
  time_end?: number;
  search?: string;
  status?: 'completed' | 'canceled';
  storefrontIds?: string[];
}

export interface GetBuyerOrdersQuery extends CommonRequestQuery {
  id: string;
}

export interface CancelOrderQuery {
  reason: string;
  order_id: string;
}
