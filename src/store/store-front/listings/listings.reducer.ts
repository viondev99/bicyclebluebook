import { Action, handleActions } from 'redux-actions';
import { ListingOnlineStoreModel } from 'model/store/store-front/listing-online-store.model';

import {
  GetListingOnlineStoreModel,
  GetShipmentReturnResponse,
  ListingOnlineStoreResponse,
} from 'model/api/store-front/listings-online-store.model';
import { ListingsReturnParamsModel } from 'model/store/account/personal/listings.model';
import {
  ListingsReturnResponse,
  InventoryShipmentResponse,
  CountNewReturn,
} from 'model/api/account/personal/listings.model';
import { ListingsOnlineStorePayload } from './listings.action';

const INIT_STATE: ListingOnlineStoreModel = {
  queryParams: null,
  listListingOnlineStore: null,
  listListingReturn: null,
  listInventory: null,
  loading: false,
  countNewReturn: 0,
  countNewCancel: 0,
  shipping: null,
};

const listingOnlineStoreReducer = handleActions<ListingOnlineStoreModel, ListingsOnlineStorePayload>(
  {
    GET_LISTINGS_ONLINE_STORE: (state, action: Action<GetListingOnlineStoreModel>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LISTINGS_ONLINE_STORE_SUCCEEDED: (state, action: Action<ListingOnlineStoreResponse>) => {
      return {
        ...state,
        listListingOnlineStore: action.payload,
        loading: false,
      };
    },
    GET_LISTINGS_ONLINE_STORE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_LISTINGS_RETURN_ONLINE_STORE: (state, action: Action<ListingsReturnParamsModel>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LISTINGS_RETURN_ONLINE_STORE_SUCCEEDED: (state, action: Action<ListingsReturnResponse>) => {
      return {
        ...state,
        listListingReturn: action.payload,
        loading: false,
      };
    },
    GET_LISTINGS_RETURN_ONLINE_STORE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    DELETE_LISTING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    DELETE_LISTING_SUCCEEDED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    DELETE_LISTING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_INVENTORY_SHIPMENT: (state) => {
      return {
        ...state,
      };
    },
    GET_INVENTORY_SHIPMENT_SUCCEEDED: (state, action: Action<InventoryShipmentResponse>) => {
      return {
        ...state,
        listInventory: action.payload,
      };
    },
    GET_INVENTORY_SHIPMENT_FAILED: (state) => {
      return {
        ...state,
      };
    },
    GET_COUNT_NEW_RETURN: (state) => {
      return {
        ...state,
      };
    },
    GET_COUNT_NEW_RETURN_SUCCEEDED: (state, action: Action<CountNewReturn>) => {
      return {
        ...state,
        countNewReturn: action.payload.total_new,
      };
    },
    GET_COUNT_NEW_RETURN_FAILED: (state) => {
      return {
        ...state,
      };
    },
    GET_COUNT_NEW_CANCEL: (state) => {
      return {
        ...state,
      };
    },
    GET_COUNT_NEW_CANCEL_SUCCEEDED: (state, action: Action<CountNewReturn>) => {
      return {
        ...state,
        countNewCancel: action.payload.total_new,
      };
    },
    GET_COUNT_NEW_CANCEL_FAILED: (state) => {
      return {
        ...state,
      };
    },
    CHECK_SHIPPING: (state) => {
      return {
        ...state,
        shipping: null,
        loading: true,
      };
    },
    CHECK_SHIPPING_SUCCEEDED: (state, action: Action<GetShipmentReturnResponse>) => {
      return {
        ...state,
        shipping: action.payload,
        loading: false,
      };
    },
    CHECK_SHIPPING_FAILED: (state) => {
      return {
        ...state,
        shipping: null,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'listings-online-store',
  },
);

export default listingOnlineStoreReducer;
