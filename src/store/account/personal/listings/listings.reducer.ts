import { Action, handleActions } from 'redux-actions';
import {
  ListingsResponse,
  DeleteListingResponse,
  ListingsReturnResponse,
  DetailListingListedResponse,
  CreateListingDraftResponse,
} from 'model/api/account/personal/listings.model';
import { DataList } from 'model/common';
import {
  DetailListingDraft,
  ListingsModel,
  ListingsReturnParamsModel,
  ListingsStoreModel,
} from 'model/store/account/personal/listings.model';
import { ListingCancelledResponse, ListingsPayload } from './listings.action';

const INIT_STATE: ListingsStoreModel = {
  listings: null,
  listingsReturn: null,
  listingsCancelled: new DataList(),
  detailListingListed: null,
  detailListingDraft: undefined,
  loading: false,
  dataCreateDraftListing: null,
  filter: {
    page: 1,
    size: 0,
    sortField: '',
    sortType: '',
  },
};

const listingReducer = handleActions<ListingsStoreModel, ListingsPayload>(
  {
    GET_LISTINGS: (state, action: Action<ListingsModel>) => {
      return {
        ...state,
        loading: true,
        filter: action.payload,
      };
    },
    GET_LISTINGS_SUCCEEDED: (state, action: Action<ListingsResponse>) => {
      return {
        ...state,
        listings: action.payload,
        loading: false,
      };
    },
    GET_LISTINGS_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    DELETE_LISTINGS: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    DELETE_LISTINGS_SUCCEEDED: (state, action: Action<DeleteListingResponse>) => {
      return {
        ...state,
        loading: false,
      };
    },
    DELETE_LISTINGS_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    MARK_LISTINGS_AS_SHIPPED: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    MARK_LISTINGS_AS_SHIPPED_SUCCEEDED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    MARK_LISTINGS_AS_SHIPPED_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    PATCH_RE_LIST_SOLD_LISTING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    PATCH_RE_LIST_SOLD_LISTING_SUCCEEDED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    PATCH_RE_LIST_SOLD_LISTING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_LISTINGS_MANAGER_RETURN: (state, action: Action<ListingsReturnParamsModel>) => {
      return {
        ...state,
        loading: true,
        filter: action.payload,
      };
    },
    GET_LISTINGS_MANAGER_RETURN_SUCCEEDED: (state, action: Action<ListingsReturnResponse>) => {
      return {
        ...state,
        listingsReturn: action.payload,
        loading: false,
      };
    },
    GET_LISTINGS_MANAGER_RETURN_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_DETAIL_LISTING_LISTED: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_DETAIL_LISTING_LISTED_SUCCEEDED: (state, action: Action<DetailListingListedResponse>) => {
      return {
        ...state,
        detailListingListed: action.payload,
        loading: false,
      };
    },
    GET_DETAIL_LISTING_LISTED_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_DETAIL_LISTING_DRAFT: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_DETAIL_LISTING_DRAFT_SUCCEEDED: (state, action: Action<DetailListingDraft>) => {
      return {
        ...state,
        detailListingDraft: action.payload,
        loading: false,
      };
    },
    GET_DETAIL_LISTING_DRAFT_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_LISTINGS_CANCELLED: (state, action: Action<ListingsReturnParamsModel>) => {
      return {
        ...state,
        loading: true,
        filter: action.payload,
      };
    },
    GET_LISTINGS_CANCELLED_SUCCEEDED: (state, action: Action<ListingCancelledResponse>) => {
      return {
        ...state,
        listingsCancelled: action.payload,
        loading: false,
      };
    },
    GET_LISTINGS_CANCELLED_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },

    CREATE_DRAFT_LISTING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    CREATE_DRAFT_LISTING_SUCCEEDED: (state, action: Action<CreateListingDraftResponse>) => {
      return {
        ...state,
        dataCreateDraftListing: action.payload,
        loading: false,
      };
    },
    CREATE_DRAFT_LISTING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'listings',
  },
);

export default listingReducer;
