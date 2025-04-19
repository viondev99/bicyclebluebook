import { Action, handleActions } from 'redux-actions';
import { TradeCreditPayload } from './trade-credit.action';
import {
  TradeCreditStoreModel,
  TradeCreditItemModal,
  GiftDetailCustomerModal,
} from '../../../../model/store/account/personal/trade-credit.model';
import { DataList } from '../../../../model/common';
import {
  GetGiftHistoryByCustomer,
  GetListGiftHistory,
} from '../../../../model/api/account/personal/trade-credit.model';

const INIT_STATE: TradeCreditStoreModel = {
  queryParams: {
    page: 1,
    page_size: 5,
    sort: 'date_created:-1',
    where: '',
  },
  listTradeCredit: null,
  giftDetailCustomer: null,
  loading: false,
  checkData: false,
};

const tradeCreditReducer = handleActions<TradeCreditStoreModel, TradeCreditPayload>(
  {
    GET_LIST_TRADE_CREDIT: (state, action: Action<GetListGiftHistory>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LIST_TRADE_CREDIT_SUCCEEDED: (state, action: Action<DataList<TradeCreditItemModal>>) => {
      return {
        ...state,
        listTradeCredit: action.payload,
        loading: false,
      };
    },
    GET_LIST_TRADE_CREDIT_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_GIFT_BY_CUSTOMER: (state, action: Action<GetGiftHistoryByCustomer>) => {
      return {
        ...state,
        loading: true,
        checkData: false,
      };
    },
    GET_GIFT_BY_CUSTOMER_SUCCEEDED: (state, action: Action<GiftDetailCustomerModal>) => {
      return {
        ...state,
        giftDetailCustomer: action.payload,
        loading: false,
        checkData: false,
      };
    },
    GET_GIFT_BY_CUSTOMER_FAILED: (state) => {
      return {
        ...state,
        loading: false,
        checkData: true,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'trade-credit',
  },
);

export default tradeCreditReducer;
