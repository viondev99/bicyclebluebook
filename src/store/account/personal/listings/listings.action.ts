import { createActions } from 'redux-actions';
import {
  DetailListingDraft,
  ListingsModel,
  ListingsReturnParamsModel,
  MarkListingModal,
  RelistSoldModal,
} from 'model/store/account/personal/listings.model';
import { DataList } from 'model/common';
import {
  DeleteListingResponse,
  ListingsResponse,
  ListingsReturnResponse,
  DeleteListingPayload,
  CreateListingDraftRequest,
  DetailListingListedResponse,
  ListingCancelledItem,
  CreateListingDraftResponse,
} from 'model/api/account/personal/listings.model';

export type MarkListingSuccessPayload = MarkListingModal;

export type RelistSoldSuccessPayload = RelistSoldModal;

export type ListingCancelledResponse = DataList<ListingCancelledItem>;

export type ListingsPayload =
  | ListingsResponse
  | ListingsModel
  | DeleteListingPayload
  | string
  | DeleteListingResponse
  | MarkListingSuccessPayload
  | RelistSoldSuccessPayload
  | ListingsReturnParamsModel
  | ListingsReturnResponse
  | CreateListingDraftRequest
  | CreateListingDraftResponse
  | DetailListingListedResponse
  | ListingCancelledResponse
  | DetailListingDraft;

export const {
  getListings,
  getListingsSucceeded,
  getListingsFailed,
  createDraftListing,
  createDraftListingSucceeded,
  createDraftListingFailed,
  deleteListings,
  deleteListingsSucceeded,
  deleteListingsFailed,
  markListingsAsShipped,
  markListingsAsShippedSucceeded,
  markListingsAsShippedFailed,
  patchReListSoldListing,
  patchReListSoldListingSucceeded,
  patchReListSoldListingFailed,
  getListingsManagerReturn,
  getListingsManagerReturnSucceeded,
  getListingsManagerReturnFailed,
  getDetailListingListed,
  getDetailListingListedSucceeded,
  getDetailListingListedFailed,
  getDetailListingDraft,
  getDetailListingDraftSucceeded,
  getDetailListingDraftFailed,
  getListingsCancelled,
  getListingsCancelledSucceeded,
  getListingsCancelledFailed,
} = createActions<ListingsPayload>(
  {
    GET_LISTINGS: (payload: ListingsModel) => payload,
    GET_LISTINGS_SUCCEEDED: (payload: ListingsResponse) => payload,
    GET_LISTINGS_FAILED: null,
    CREATE_DRAFT_LISTING: (payload: CreateListingDraftRequest) => payload,
    CREATE_DRAFT_LISTING_SUCCEEDED: (payload: CreateListingDraftResponse) => payload,
    CREATE_DRAFT_LISTING_FAILED: null,
    DELETE_LISTINGS: (payload: DeleteListingPayload) => payload,
    DELETE_LISTINGS_SUCCEEDED: (payload: DeleteListingResponse) => payload,
    DELETE_LISTINGS_FAILED: null,
    MARK_LISTINGS_AS_SHIPPED: (payload: string) => payload,
    MARK_LISTINGS_AS_SHIPPED_SUCCEEDED: (payload: MarkListingSuccessPayload) => payload,
    MARK_LISTINGS_AS_SHIPPED_FAILED: null,
    PATCH_RE_LIST_SOLD_LISTING: (payload: string) => payload,
    PATCH_RE_LIST_SOLD_LISTING_SUCCEEDED: (payload: RelistSoldSuccessPayload) => payload,
    PATCH_RE_LIST_SOLD_LISTING_FAILED: null,
    GET_LISTINGS_MANAGER_RETURN: (payload: ListingsReturnParamsModel) => payload,
    GET_LISTINGS_MANAGER_RETURN_SUCCEEDED: (payload: ListingsReturnResponse) => payload,
    GET_LISTINGS_MANAGER_RETURN_FAILED: null,
    GET_DETAIL_LISTING_LISTED: (payload: string) => payload,
    GET_DETAIL_LISTING_LISTED_SUCCEEDED: (payload: DetailListingListedResponse) => payload,
    GET_DETAIL_LISTING_LISTED_FAILED: null,
    GET_DETAIL_LISTING_DRAFT: (payload: string) => payload,
    GET_DETAIL_LISTING_DRAFT_SUCCEEDED: (payload: DetailListingDraft) => payload,
    GET_DETAIL_LISTING_DRAFT_FAILED: null,
    GET_LISTINGS_CANCELLED: (payload: ListingsReturnParamsModel) => payload,
    GET_LISTINGS_CANCELLED_SUCCEEDED: (payload: ListingCancelledResponse) => payload,
    GET_LISTINGS_CANCELLED_FAILED: null,
  },
  {
    prefix: 'listings',
  },
);
