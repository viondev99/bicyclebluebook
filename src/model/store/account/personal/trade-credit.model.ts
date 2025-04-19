import { DataList } from '../../../common';
import { GetListGiftHistory } from '../../../api/account/personal/trade-credit.model';

export interface TradeCreditItemModal {
  action: string;
  balance: number;
  created_by: string;
  date_created: string;
  date_updated: string;
  gift_id: string;
  name_created_by: string;
  transaction_date: string;
  transaction_id: string;
  transaction_item: 1;
  transaction_line: string[];
  transaction_receipt: string;
  transaction_total: number;
  value_change: number;
  value_origin: number;
  _id: string;
  scorecard_info?: string;
  scorecard?: number;
  order_code?: string;
  order_date?: string;
  order_id?: string;
  order_item?: number;
  order_line?: string[];
  order_total?: number;
}

export interface TransactionItem {
  receipt_id: string;
  _id: string;
}

export interface GiftDetailCustomerModal {
  coupon_code: string;
  coupon_value: number;
  customer: {
    billing_address: { country_code: string };
    first_name: string;
    last_name: string;
    email: string;
    id: string;
    phone: string;
  };
  date_created: string;
  date_updated: string;
  is_deleted: boolean;
  status: boolean;
  transactions: TransactionItem[];
  value_card: {
    price: number;
    balance: number;
  };
  _id: string;
  giftcard_code?: string;
}

export interface TradeCreditStoreModel {
  queryParams: GetListGiftHistory;
  listTradeCredit: DataList<TradeCreditItemModal>;
  giftDetailCustomer: GiftDetailCustomerModal;
  loading: boolean;
  checkData?: boolean;
}
