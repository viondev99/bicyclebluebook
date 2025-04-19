import { Action, handleActions } from 'redux-actions';
import { DataList } from 'model/common';
import { GetOrdersFailedPayload, GetOrdersSuccessPayload, OrderPayload } from '../orders.action';
import { ListingStoreModel } from 'model/store/store-front/order.model';

const INIT_STATE: ListingStoreModel = {
  orders: new DataList(),
  loading: true,
  error: '',
};

const reducer = handleActions<ListingStoreModel, OrderPayload>(
  {
    GET_ORDERS: (state, action) => {
      return {
        ...state,
        loading: true,
        orders: new DataList(),
      };
    },
    GET_ORDERS_SUCCEEDED: (state, action: Action<GetOrdersSuccessPayload>) => {
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    },
    GET_ORDERS_FAILED: (state, action: Action<GetOrdersFailedPayload>) => {
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
