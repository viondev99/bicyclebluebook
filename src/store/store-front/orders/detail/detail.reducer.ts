import { Action, handleActions } from 'redux-actions';
import { GetDetailOrderSuccessPayload, OrderPayload } from '../orders.action';
import { GetDetailOrderFailedPayload } from 'store/store-front/orders/orders.action';
import { DetailStoreModel } from 'model/store/store-front/order.model';

const INIT_STATE: DetailStoreModel = {
  order: null,
  loading: true,
  error: '',
};

const reducer = handleActions<DetailStoreModel, OrderPayload>(
  {
    GET_DETAIL_ORDER: (state, action) => {
      return {
        ...state,
        loading: true,
        order: null,
      };
    },
    GET_DETAIL_ORDER_SUCCEEDED: (state, action: Action<GetDetailOrderSuccessPayload>) => {
      return {
        ...state,
        order: action.payload,
        loading: false,
      };
    },
    GET_DETAIL_ORDER_FAILED: (state, action: Action<GetDetailOrderFailedPayload>) => {
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
