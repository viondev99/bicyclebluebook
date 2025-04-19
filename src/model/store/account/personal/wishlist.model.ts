import { WishListResponse, SubscriptionResponse } from 'model/api/account/personal/wishlist.model';

export interface WishListModel {
  page: number;
  page_size: number;
  sort_type?: string;
  sort_field?: string;
}

export interface WishListStoreModel {
  queryParams: WishListModel;
  bikeSubscribeQuery: WishListModel;
  listSubscribers: WishListResponse;
  listBikeSubscribe: SubscriptionResponse;
  loading: boolean;
  loadingBike: boolean;
}
