import { stringify } from 'query-string';

import authorizedRequest from 'helpers/request/authorizedRequest';
import { Condition, ShippingType } from 'model/common';
import { TypeMarket, StatusInventory, StageInventory } from 'model/store/common.model';
import { PromiseWithCancel } from 'helpers/request/request';

export interface UserBasicInfoItem {
  _id: string;
  avatar: string;
  display_name: string;
  user_name?: string;
  email: string;
  gravatar: string;
  is_bbb_user?: boolean;
  is_bbb_store?: boolean;
  is_bbb_store_created?: boolean;
}

export type UserBasicInfoResponse = UserBasicInfoItem[];

interface StoreBasicInfoItem {
  _id: string;
  logo: string;
  name: string;
  is_bbb_store?: boolean;
  is_bbb_store_created?: boolean;
}

export type StoreBasicInfoResponse = StoreBasicInfoItem[];

export function getUsersBasicInfo(ids: String[]) {
  if (!ids.length) {
    return Promise.resolve([] as UserBasicInfoResponse);
  }
  return authorizedRequest.post<UserBasicInfoResponse>(`auth/api/v1/user/list-info-basic`, { ids });
}

export function getStoresBasicInfo(ids: String[]) {
  if (!ids.length) {
    return Promise.resolve([] as StoreBasicInfoResponse);
  }
  return authorizedRequest.post<StoreBasicInfoResponse>(`auth/api/v1/storefront/list-by-ids`, { ids });
}

export interface ProductBasicInfoItem {
  bbbValue: number;
  bestDeal: boolean;
  bestOfferAutoAcceptPrice: number;
  bicycleBrandName: string;
  bicycleId: number;
  bicycleModelName: string;
  bicycleName: string;
  bicycleSizeName: string;
  bicycleTypeName: string;
  bicycleYearName: string;
  brakeName: string;
  brakeTypeId: number;
  cityName: string;
  cogsPrice: number;
  condition: Condition;
  countryCode: string;
  countryName: string;
  currentListedPrice: number;
  delete: boolean;
  discountedPrice: number;
  flatPriceChange: number;
  frameMaterialId: number;
  frameMaterialName: string;
  frameSize: string;
  gender: string;
  imageDefault: string;
  initialListPrice: number;
  inventoryId: number;
  inventoryName: string;
  isAvailableAssembled: boolean;
  location: string;
  marketListingId: number;
  marketPlaceId: number;
  masterListingId: number;
  minimumOfferAutoAcceptPrice: number;
  msrpPrice: number;
  sellerId: string;
  serialNumber: boolean;
  shippingType: ShippingType;
  stageInventory: StageInventory;
  stateCode: string;
  stateName: string;
  statusInventory: StatusInventory;
  statusMarketListing: StatusInventory;
  storefrontId: string;
  suspension: string;
  title: string;
  totalForSale: number;
  totalListings: number;
  totalSalePending: number;
  totalSold: number;
  type: TypeMarket;
  typeInventoryId: number;
  typeInventoryName: string;
  wheelSize: string;
  zipCode: string;
}

export type ProductsBasicInfoResponse = ProductBasicInfoItem[];

export function getProductsBasicInfo(ids: Number[]) {
  if (!ids.length) {
    return Promise.resolve([] as ProductsBasicInfoResponse);
  }
  return authorizedRequest.post<ProductsBasicInfoResponse>(
    `core/api/message/masterListings`,
    stringify({ masterListingIds: ids }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

export interface StockLocationInfoItem {
  _id: string;
  v1_id: string;
  warehouse: string;
  name: string;
  location_name: string;
}

export type StockLocationsInfoResponse = StockLocationInfoItem[];

export function getStockLocationInfo(ids: String[]) {
  if (!ids.length) {
    return Promise.resolve([] as StockLocationsInfoResponse);
  }
  return authorizedRequest.post<StockLocationsInfoResponse>(`auth/api/v1/stock-location/get-list-by-ids`, { ids });
}

interface GetBankInfoResponse {
  id: string;
  object: string;
  account: string;
  account_holder_name: string;
  account_holder_type: string;
  bank_name: string;
  country: string;
  currency: string;
  default_for_currency: boolean;
  fingerprint: string;
  last4: string;
  routing_number: string;
  status: string;
}

export function getBankInfo(): PromiseWithCancel<GetBankInfoResponse[]> {
  return authorizedRequest.get<GetBankInfoResponse[]>(
    `billing/api/v1/payment/stripe/account/get-bank-account-by-user-id`,
  );
}
