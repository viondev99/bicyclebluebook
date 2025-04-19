import { StoreInfoResponse, UserInfoResponse } from 'api/common.api';

export interface SellerStoreModel {
  onlineStoreInfo: StoreInfoResponse;
  sellerInfo: UserInfoResponse;
  loading: boolean;
}
