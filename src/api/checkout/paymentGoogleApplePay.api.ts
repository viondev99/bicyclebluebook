export interface Details {
  subtotal: number;
  tax: number;
  shipping: number;
  insurance: number;
}

export interface Amount {
  details: Details;
  currency: string;
  total: number;
}

export interface FrameSize {
  _id: string;
  all: number;
  frame_size: string;
  total_for_sale: number;
  total_sold: number;
}

export interface LineItem {
  is_buyer_return: boolean;
  amount_refund: number;
  stage_pay: string;
  quantity: number;
  frame_size: string;
  market_listing_ids: any[];
  inventory_ids: any[];
  is_calculate_ship_failed: boolean;
  is_calculate_tax_failed: boolean;
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
  frame_sizes: FrameSize[];
  image_default: string;
  initial_list_price: number;
  location: string;
  model_id: number;
  name: string;
  partner_id: string;
  shipping_type: string;
  shipping_fee: string;
  shipping_profile_label: string;
  stage: string;
  status: string;
  title: string;
  total_for_sale: number;
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
  market_listings: any[];
  date_created: Date;
  date_updated: Date;
  discount: number;
}

export interface ShippingAddress {
  recipient_name: string;
  city: string;
  line1: string;
  phone: string;
  postal_code: string;
  state: string;
}

export interface BillingAddress {
  recipient_name: string;
  city: string;
  line1: string;
  phone: string;
  postal_code: string;
  state: string;
}

export interface ResponseOrderV2 {
  amount: Amount;
  order_code: string;
  user_type: string;
  is_bbb: boolean;
  seller: string[];
  storefronts: string[];
  e_check: boolean;
  is_payout_to_seller: boolean;
  transfers_reversal: any[];
  is_buyer_confirm: boolean;
  is_delivered: boolean;
  is_complain: boolean;
  status: string;
  stage: string;
  _id: string;
  user: string;
  customer_name: string;
  report_buyer_id: string;
  line_item: LineItem[];
  discount: number;
  receipt_id: string;
  state_stripe: string;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  date_created: Date;
  date_updated: Date;
}

export interface ConfirmPaymentGoogleApplePayRequestParams {
  order_id: string;
  payment_method_id: string;
  payment_method: string;
}
export interface ConfirmPaymentGoogleApplePayGuestRequest {
  order_id: string;
  payment_method_id: string;
  payment_method: string;
  customer_email: string;
}
