import { Action, handleActions } from 'redux-actions';
import { StoreInfoResponse, UserInfoResponse } from 'api/common.api';
import { SellerStoreModel } from 'model/store/seller.model';
import { SellerPayload } from './seller.action';

const INIT_STATE: SellerStoreModel = {
  onlineStoreInfo: null,
  sellerInfo: null,
  loading: false,
};

const sellerReducer = handleActions<SellerStoreModel, SellerPayload>(
  {
    GET_ONLINE_STORE_INFO: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_ONLINE_STORE_INFO_SUCCEEDED: (state, action: Action<StoreInfoResponse>) => {
      return {
        ...state,
        onlineStoreInfo: action.payload,
        loading: false,
      };
    },
    GET_ONLINE_STORE_INFO_FAILED: (state) => {
      return {
        ...state,
        loading: false,
        onlineStoreInfo: null,
      };
    },
    GET_SELLER_INFO: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_SELLER_INFO_SUCCEEDED: (state, action: Action<UserInfoResponse>) => {
      return {
        ...state,
        sellerInfo: action.payload,
        loading: false,
      };
    },
    GET_SELLER_INFO_FAILED: (state) => {
      return {
        ...state,
        loading: false,
        sellerInfo: null,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'seller-marketplace',
  },
);

export default sellerReducer;
