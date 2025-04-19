import { WishListResponse, SubscriptionResponse } from 'model/api/account/personal/wishlist.model';
import { WishListModel } from '../../../model/store/account/personal/wishlist.model';
import { PromiseWithCancel } from '../../../helpers/request/request';
import authorizedRequest from '../../../helpers/request/authorizedRequest';

export function getListSearchSubscriber(data: WishListModel): PromiseWithCancel<WishListResponse> {
  return authorizedRequest.get<WishListResponse>(`subscription/api/v1/search`, { params: data });
}

export function deleteSubscriberWishlist(data: string): PromiseWithCancel<string> {
  return authorizedRequest.delete<string>(`subscription/api/v1/search/${data}`);
}

export function getListSubscription(data: WishListModel): PromiseWithCancel<SubscriptionResponse> {
  return authorizedRequest.get<SubscriptionResponse>(`subscription/api/v1/subscription`, { params: data });
}
