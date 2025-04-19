import { createActions } from 'redux-actions';
import { StoreInfoResponse, UserInfoResponse } from 'api/common.api';

export type SellerPayload = string | StoreInfoResponse | UserInfoResponse;

export const {
  getOnlineStoreInfo,
  getOnlineStoreInfoSucceeded,
  getOnlineStoreInfoFailed,
  getSellerInfo,
  getSellerInfoSucceeded,
  getSellerInfoFailed,
} = createActions<SellerPayload>(
  {
    GET_ONLINE_STORE_INFO: (id: string) => id,
    GET_ONLINE_STORE_INFO_SUCCEEDED: (id: StoreInfoResponse) => id,
    GET_ONLINE_STORE_INFO_FAILED: (message: string) => message,
    GET_SELLER_INFO: (id: string) => id,
    GET_SELLER_INFO_SUCCEEDED: (id: UserInfoResponse) => id,
    GET_SELLER_INFO_FAILED: (message: string) => message,
  },
  {
    prefix: 'seller-marketplace',
  },
);
