import { Product } from 'model/common';

export interface UserBasicInfoModel {
  id: string;
  name: string;
  avatar: string;
  gravatar?: string;
  displayName?: string;
  userName?: string;
  is_bbb_user?: boolean;
  is_bbb_store?: boolean;
  is_bbb_store_created?: boolean;
}

export interface StockLocationInfoModel {
  id: string;
  warehouse: string;
  name: string;
  locationName: string;
}

export interface InfoStoreModel {
  userIds: String[];
  usersInfo: UserBasicInfoModel[];
  userLoading: boolean;
  storeIds: String[];
  storesInfo: UserBasicInfoModel[];
  storeLoading: boolean;
  productIds: Number[];
  productsInfo: Partial<Product>[];
  productLoading: boolean;
  stockLocationIds: String[];
  stockLocationsInfo: StockLocationInfoModel[];
  stockLocationLoading: boolean;
  error: string;
}
