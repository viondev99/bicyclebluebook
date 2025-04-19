import { createActions } from 'redux-actions';
import {
  GetListingOnlineStoreModel,
  GetShipmentReturnResponse,
  ListingOnlineStoreResponse,
} from 'model/api/store-front/listings-online-store.model';
import { ListingsReturnParamsModel, DeleteListingModel } from 'model/store/account/personal/listings.model';
import {
  ListingsReturnResponse,
  DeleteListingResponse,
  InventoryShipmentResponse,
  CountNewReturn,
} from 'model/api/account/personal/listings.model';

export type ListingsOnlineStorePayload =
  | GetListingOnlineStoreModel
  | ListingOnlineStoreResponse
  | ListingsReturnParamsModel
  | ListingsReturnResponse
  | DeleteListingResponse
  | DeleteListingModel
  | string
  | InventoryShipmentResponse
  | CountNewReturn
  | GetShipmentReturnResponse;

export const {
  getListingsOnlineStore,
  getListingsOnlineStoreSucceeded,
  getListingsOnlineStoreFailed,
  getListingsReturnOnlineStore,
  getListingsReturnOnlineStoreSucceeded,
  getListingsReturnOnlineStoreFailed,
  deleteListing,
  deleteListingSucceeded,
  deleteListingFailed,
  getInventoryShipment,
  getInventoryShipmentSucceeded,
  getInventoryShipmentFailed,
  getCountNewReturn,
  getCountNewReturnSucceeded,
  getCountNewReturnFailed,
  getCountNewCancel,
  getCountNewCancelSucceeded,
  getCountNewCancelFailed,
  checkShipping,
  checkShippingSucceeded,
  checkShippingFailed,
} = createActions<ListingsOnlineStorePayload>(
  {
    GET_LISTINGS_ONLINE_STORE: (payload: GetListingOnlineStoreModel) => payload,
    GET_LISTINGS_ONLINE_STORE_SUCCEEDED: (payload: ListingOnlineStoreResponse) => payload,
    GET_LISTINGS_ONLINE_STORE_FAILED: null,
    GET_LISTINGS_RETURN_ONLINE_STORE: (payload: ListingsReturnParamsModel) => payload,
    GET_LISTINGS_RETURN_ONLINE_STORE_SUCCEEDED: (payload: ListingsReturnResponse) => payload,
    GET_LISTINGS_RETURN_ONLINE_STORE_FAILED: null,
    DELETE_LISTING: (payload: DeleteListingModel) => payload,
    DELETE_LISTING_SUCCEEDED: (payload: DeleteListingResponse) => payload,
    DELETE_LISTING_FAILED: null,
    GET_INVENTORY_SHIPMENT: (payload: string) => payload,
    GET_INVENTORY_SHIPMENT_SUCCEEDED: (payload: InventoryShipmentResponse) => payload,
    GET_INVENTORY_SHIPMENT_FAILED: null,
    GET_COUNT_NEW_RETURN: null,
    GET_COUNT_NEW_RETURN_SUCCEEDED: (payload: CountNewReturn) => payload,
    GET_COUNT_NEW_RETURN_FAILED: null,
    GET_COUNT_NEW_CANCEL: null,
    GET_COUNT_NEW_CANCEL_SUCCEEDED: (payload: CountNewReturn) => payload,
    GET_COUNT_NEW_CANCEL_FAILED: null,
    CHECK_SHIPPING: (payload: string) => payload,
    CHECK_SHIPPING_SUCCEEDED: (payload: GetShipmentReturnResponse) => payload,
    CHECK_SHIPPING_FAILED: null,
  },
  {
    prefix: 'listings-online-store',
  },
);
