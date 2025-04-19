import { FrameSize } from '../../../api/checkout/cart.api';
import { ShippingSingle } from './shipping.model';
import { MarketListingModel } from '../account/personal/orders.model';
import { BillingAddressForm } from 'components/Checkout/Shipping/ShippingForm/CustomerForm';

export interface CartModel {
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
  frame_sizes: any[];
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
}

export interface CustomerInfoModel {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  create?: boolean;
  password?: string;
  confirmPassword?: string;
  subscription?: boolean;
  captcha?: string;
  description?: string;
}

export interface listCartCheckedModel {
  id: number | string;
  isChecked: boolean;
}
export type CreateGuestStatus = 'idle' | 'waiting' | 'success' | 'failed';

export interface CartStoreModel {
  carts: CartModel[];
  shipping?: Partial<ShippingSingle>;
  billingAddressForm?: BillingAddressForm;
  customer?: Partial<CustomerInfoModel>;
  adding: number[];
  removing: number[];
  changing: number[];
  loading: boolean;
  syncing: boolean;
  applyingCoupon: boolean;
  couponCode: string;
  statusCreateAccount: string;
  disableLoading?: boolean;
  listCartIsChecked?: listCartCheckedModel[];
  socketConnection: any;
  loadingAddCart: boolean;
  createGuestStatus: CreateGuestStatus;
}
