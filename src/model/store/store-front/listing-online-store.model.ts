import {
  GetListingOnlineStoreModel,
  GetShipmentReturnResponse,
  ListingOnlineStoreResponse,
} from 'model/api/store-front/listings-online-store.model';
import { ListingsReturnResponse, InventoryShipmentResponse } from 'model/api/account/personal/listings.model';

export interface ListingOnlineStoreModel {
  queryParams: GetListingOnlineStoreModel;
  listListingOnlineStore: ListingOnlineStoreResponse;
  listInventory: InventoryShipmentResponse;
  listListingReturn: ListingsReturnResponse;
  loading: boolean;
  countNewReturn?: number;
  countNewCancel?: number;
  shipping?: GetShipmentReturnResponse;
}
