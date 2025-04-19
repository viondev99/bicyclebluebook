import { LineItemModel } from 'model/store/account/personal/orders.model';
import { DataList } from '../../common';

export interface ListingStoreModel {
  error: string | null;
  loading: boolean;
  orders: DataList<OrderModel>;
}

export interface DetailStoreModel {
  error: string | null;
  loading: boolean;
  order: DetailOrderModel;
}

export interface OrderModel {
  buyer_request_cancel: boolean;
  seller_cancel: boolean;
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
  is_payout_to_seller?: boolean;
}

export interface AmountModel {
  total: number;
  currency: string;
  details: AmountDetailModel;
}

export interface AmountDetailModel {
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
  amount_refund?: number;
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

export interface DetailOrderModel {
  amount: AmountModel;
  order_code: string;
  buyer_request_cancel?: boolean;
  buyer_reason_cancel?: string;
  date_cancel: string;
  seller_cancel: boolean;
  seller_reason_cancel: string;
  user_type: string;
  seller: string[];
  storefronts: string[];
  e_check: boolean;
  status: string;
  stage: string;
  _id: string;
  user: string;
  billing_address: AddressModel;
  customer_name: string;
  date_created: Date;
  date_updated: Date;
  discount: number;
  increase: number;
  line_item: LineItemModel[];
  receipt_id: string;
  report_buyer_id: string;
  shipping_address: AddressModel;
  payment_method: string;
  payment_method_stripe?: string;
  paypal: PaypalModel;
  date_finish: Date;
  coupon?: {
    code?: string;
  };
  cart_type?: string;
}

export interface AmountCustom {
  inventory_id?: number;
  refunded?: boolean;
  amountAccept?: number;
  quantityAllowRefund?: number;
  amount: number;
  id: string;
  item?: LineItemModel;
}
