import { createActions } from 'redux-actions';
import { WishListResponse, SubscriptionResponse } from 'model/api/account/personal/wishlist.model';
import { WishListModel } from '../../../../model/store/account/personal/wishlist.model';

export type WishlistPayload = WishListModel | WishListResponse | string | SubscriptionResponse;

export const {
  getListSearchSubscriber,
  getListSearchSubscriberSucceeded,
  getListSearchSubscriberFailed,
  deleteSubscriberWishlist,
  deleteSubscriberWishlistSucceeded,
  deleteSubscriberWishlistFailed,
  getListSubscription,
  getListSubscriptionSucceeded,
  getListSubscriptionFailed,
} = createActions<WishlistPayload>(
  {
    GET_LIST_SEARCH_SUBSCRIBER: (payload: WishListModel) => payload,
    GET_LIST_SEARCH_SUBSCRIBER_SUCCEEDED: (payload: WishListResponse) => payload,
    GET_LIST_SEARCH_SUBSCRIBER_FAILED: null,
    DELETE_SUBSCRIBER_WISHLIST: (payload: string) => payload,
    DELETE_SUBSCRIBER_WISHLIST_SUCCEEDED: (payload: string) => payload,
    DELETE_SUBSCRIBER_WISHLIST_FAILED: null,
    GET_LIST_SUBSCRIPTION: (payload: WishListModel) => payload,
    GET_LIST_SUBSCRIPTION_SUCCEEDED: (payload: SubscriptionResponse) => payload,
    GET_LIST_SUBSCRIPTION_FAILED: null,
  },
  {
    prefix: 'wishlist',
  },
);
