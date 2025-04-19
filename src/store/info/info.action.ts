import { createActions } from 'redux-actions';

import { Product } from '../../model/common';
import { UserBasicInfoModel, StockLocationInfoModel } from '../../model/store/info.model';

export type GetUsersInfoPayload = String[];

export type GetUsersInfoSucceededPayload = UserBasicInfoModel[];

export type GetUsersInfoFailedPayload = string;

export type GetStoresInfoPayload = String[];

export type GetStoresInfoSucceededPayload = UserBasicInfoModel[];

export type GetStoresInfoFailedPayload = string;

export type GetProductsInfoPayload = Number[];

export type GetProductsInfoSucceededPayload = Partial<Product>[];

export type GetProductsInfoFailedPayload = string;

export type GetStockLocationsInfoPayload = String[];

export type GetStockLocationsInfoSucceededPayload = StockLocationInfoModel[];

export type GetStockLocationsInfoFailedPayload = string;

export type InfoPayload =
  | GetUsersInfoPayload
  | GetUsersInfoSucceededPayload
  | GetUsersInfoFailedPayload
  | GetStoresInfoPayload
  | GetStoresInfoSucceededPayload
  | GetStoresInfoFailedPayload
  | GetProductsInfoPayload
  | GetProductsInfoSucceededPayload
  | GetProductsInfoFailedPayload
  | GetStockLocationsInfoPayload
  | GetStockLocationsInfoSucceededPayload
  | GetStockLocationsInfoFailedPayload;

export const {
  getUsersInfo,
  getUsersInfoSucceeded,
  getUsersInfoFailed,
  getStoresInfo,
  getStoresInfoSucceeded,
  getStoresInfoFailed,
  getProductsInfo,
  getProductsInfoSucceeded,
  getProductsInfoFailed,
  getStockLocationsInfo,
  getStockLocationsInfoSucceeded,
  getStockLocationsInfoFailed,
} = createActions<InfoPayload>(
  {
    GET_USERS_INFO: (payload: GetUsersInfoPayload) => payload,
    GET_USERS_INFO_SUCCEEDED: (payload: GetUsersInfoSucceededPayload) => payload,
    GET_USERS_INFO_FAILED: (payload: GetUsersInfoFailedPayload) => payload,
    GET_STORES_INFO: (payload: GetStoresInfoPayload) => payload,
    GET_STORES_INFO_SUCCEEDED: (payload: GetStoresInfoSucceededPayload) => payload,
    GET_STORES_INFO_FAILED: (payload: GetStoresInfoFailedPayload) => payload,
    GET_PRODUCTS_INFO: (payload: GetProductsInfoPayload) => payload,
    GET_PRODUCTS_INFO_SUCCEEDED: (payload: GetProductsInfoSucceededPayload) => payload,
    GET_PRODUCTS_INFO_FAILED: (payload: GetProductsInfoFailedPayload) => payload,
    GET_STOCK_LOCATIONS_INFO: (payload: GetStockLocationsInfoPayload) => payload,
    GET_STOCK_LOCATIONS_INFO_SUCCEEDED: (payload: GetStockLocationsInfoSucceededPayload) => payload,
    GET_STOCK_LOCATIONS_INFO_FAILED: (payload: GetStockLocationsInfoFailedPayload) => payload,
  },
  {
    prefix: 'info',
  },
);
