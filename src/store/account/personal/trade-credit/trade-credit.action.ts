import { createActions } from 'redux-actions';
import {
  TradeCreditItemModal,
  GiftDetailCustomerModal,
} from '../../../../model/store/account/personal/trade-credit.model';
import { DataList } from '../../../../model/common';
import {
  GetListGiftHistory,
  GetGiftHistoryByCustomer,
} from '../../../../model/api/account/personal/trade-credit.model';

export type TradeCreditPayload =
  | GetListGiftHistory
  | DataList<TradeCreditItemModal>
  | GetGiftHistoryByCustomer
  | GiftDetailCustomerModal;

export const {
  getListTradeCredit,
  getListTradeCreditSucceeded,
  getListTradeCreditFailed,
  getGiftByCustomer,
  getGiftByCustomerSucceeded,
  getGiftByCustomerFailed,
} = createActions<TradeCreditPayload>(
  {
    GET_LIST_TRADE_CREDIT: (payload: GetListGiftHistory) => payload,
    GET_LIST_TRADE_CREDIT_SUCCEEDED: (payload: DataList<TradeCreditItemModal>) => payload,
    GET_LIST_TRADE_CREDIT_FAILED: null,
    GET_GIFT_BY_CUSTOMER: (payload: GetGiftHistoryByCustomer) => payload,
    GET_GIFT_BY_CUSTOMER_SUCCEEDED: (payload: GiftDetailCustomerModal) => payload,
    GET_GIFT_BY_CUSTOMER_FAILED: null,
  },
  {
    prefix: 'trade-credit',
  },
);
