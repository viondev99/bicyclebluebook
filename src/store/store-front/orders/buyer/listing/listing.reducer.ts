import { Action, handleActions } from 'redux-actions';
import { DataList } from 'model/common';
import { ListingStoreModel } from 'model/store/store-front/order.model';
import {
  GetBuyerOrdersFailedPayload,
  GetBuyerOrdersSuccessPayload,
  OrderPayload,
} from 'store/store-front/orders/orders.action';

const INIT_STATE: ListingStoreModel = {
  orders: new DataList(),
  loading: true,
  error: '',
};

const reducer = handleActions<ListingStoreModel, OrderPayload>(
  {
    GET_BUYER_ORDERS: (state, action) => {
      return {
        ...state,
        loading: true,
        orders: new DataList(),
      };
    },
    GET_BUYER_ORDERS_SUCCEEDED: (state, action: Action<GetBuyerOrdersSuccessPayload>) => {
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    },
    GET_BUYER_ORDERS_FAILED: (state, action: Action<GetBuyerOrdersFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
  },
  INIT_STATE,
  { prefix: 'STORE_FRONT/orders' },
);

export default reducer;
