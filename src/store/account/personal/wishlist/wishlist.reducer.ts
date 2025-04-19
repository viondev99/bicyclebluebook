import { Action, handleActions } from 'redux-actions';
import { WishListResponse, SubscriptionResponse } from 'model/api/account/personal/wishlist.model';
import { WishListStoreModel, WishListModel } from '../../../../model/store/account/personal/wishlist.model';
import { WishlistPayload } from './wishlist.action';

const INIT_STATE: WishListStoreModel = {
  queryParams: {
    page: 1,
    page_size: 10,
    sort_type: 'DESC',
    sort_field: 'created_at',
  },
  bikeSubscribeQuery: {
    page: 1,
    page_size: 10,
  },
  listSubscribers: null,
  listBikeSubscribe: null,
  loading: false,
  loadingBike: false,
};

const wishlistReducer = handleActions<WishListStoreModel, WishlistPayload>(
  {
    GET_LIST_SEARCH_SUBSCRIBER: (state, action: Action<WishListModel>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LIST_SEARCH_SUBSCRIBER_SUCCEEDED: (state, action: Action<WishListResponse>) => {
      return {
        ...state,
        listSubscribers: action.payload,
        loading: false,
      };
    },
    GET_LIST_SEARCH_SUBSCRIBER_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_LIST_SUBSCRIPTION: (state, action: Action<WishListModel>) => {
      return {
        ...state,
        bikeSubscribeQuery: action.payload,
        loadingBike: true,
      };
    },
    GET_LIST_SUBSCRIPTION_SUCCEEDED: (state, action: Action<SubscriptionResponse>) => {
      return {
        ...state,
        listBikeSubscribe: action.payload,
        loadingBike: false,
      };
    },
    GET_LIST_SUBSCRIPTION_FAILED: (state) => {
      return {
        ...state,
        loadingBike: false,
      };
    },
    DELETE_SUBSCRIBER_WISHLIST: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    DELETE_SUBSCRIBER_WISHLIST_SUCCEEDED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    DELETE_SUBSCRIBER_WISHLIST_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'wishlist',
  },
);

export default wishlistReducer;
