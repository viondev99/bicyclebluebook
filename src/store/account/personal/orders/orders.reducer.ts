import { Action, ActionMeta, handleActions } from 'redux-actions';
import { OrderStoreModel } from 'model/store/account/personal/orders.model';
import { DataList } from '../../../../model/common';
import {
  GetDetailMeta,
  GetDetailOrderFailedPayload,
  GetDetailOrderPayload,
  GetDetailOrderSuccessPayload,
  GetOrdersFailedPayload,
  GetOrdersPayload,
  GetOrdersSuccessPayload,
  GetReturnDetailFailedPayload,
  GetReturnDetailPayload,
  GetReturnDetailSuccessPayload,
  OrderPayload,
  GetComplaintsOrderPayload,
  GetComplainsOrderSuccessPayload,
  GetComplainsOrderFailedPayload,
} from './orders.action';

const INIT_STATE: OrderStoreModel = {
  listing: {
    error: '',
    loading: false,
    orders: new DataList(),
  },
  detail: {
    loading: false,
    error: '',
    order: null,
  },
  returnDetail: {
    loading: false,
    error: '',
    item: null,
  },
  complaint: {
    error: '',
    loading: false,
    list: [],
  },
};

const orderReducer = handleActions<OrderStoreModel, OrderPayload>(
  {
    GET_ORDERS: (state, action: Action<GetOrdersPayload>) => {
      return {
        ...state,
        listing: {
          error: '',
          loading: true,
          orders: new DataList(),
        },
      };
    },
    GET_ORDERS_SUCCEEDED: (state, action: any) => {
      return {
        ...state,
        listing: {
          loading: false,
          orders: action?.payload,
          error: '',
        },
      };
    },
    GET_ORDERS_FAILED: (state, action: Action<GetOrdersFailedPayload>) => {
      return {
        ...state,
        listing: {
          loading: false,
          error: action.payload,
          orders: new DataList(),
        },
      };
    },

    GET_DETAIL_ORDER: (state, action: ActionMeta<GetDetailOrderPayload, GetDetailMeta>) => {
      if (action.meta?.silentLoad) {
        return state;
      }
      return {
        ...state,
        detail: {
          error: '',
          loading: true,
          order: null,
        },
      };
    },
    GET_DETAIL_ORDER_SUCCEEDED: (state, action: Action<GetDetailOrderSuccessPayload>) => {
      return {
        ...state,
        detail: {
          error: '',
          loading: false,
          order: action.payload,
        },
      };
    },
    GET_DETAIL_ORDER_FAILED: (state, action: Action<GetDetailOrderFailedPayload>) => {
      return {
        ...state,
        detail: {
          error: action.payload,
          loading: false,
          order: null,
        },
      };
    },
    GET_RETURN_DETAIL: (state, action: Action<GetReturnDetailPayload>) => {
      return {
        ...state,
        returnDetail: {
          error: '',
          item: null,
          loading: true,
        },
      };
    },
    GET_RETURN_DETAIL_SUCCEEDED: (state, action: Action<GetReturnDetailSuccessPayload>) => {
      return {
        ...state,
        returnDetail: {
          error: '',
          item: action.payload,
          loading: false,
        },
      };
    },
    GET_RETURN_DETAIL_FAILED: (state, action: Action<GetReturnDetailFailedPayload>) => {
      return {
        ...state,
        returnDetail: {
          error: action.payload,
          item: null,
          loading: false,
        },
      };
    },
    GET_COMPLAINTS_ORDER: (state, action: ActionMeta<GetComplaintsOrderPayload, GetDetailMeta>) => {
      if (action.meta?.silentLoad) {
        return state;
      }
      return {
        ...state,
        complaint: {
          error: '',
          loading: true,
          list: [],
        },
      };
    },
    GET_COMPLAINTS_ORDER_SUCCEEDED: (state, action: Action<GetComplainsOrderSuccessPayload>) => {
      return {
        ...state,
        complaint: {
          error: '',
          loading: false,
          list: action.payload,
        },
      };
    },
    GET_COMPLAINTS_ORDER_FAILED: (state, action: Action<GetComplainsOrderFailedPayload>) => {
      return {
        ...state,
        complaint: {
          error: action.payload,
          loading: true,
          list: [],
        },
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'orders',
  },
);

export default orderReducer;
