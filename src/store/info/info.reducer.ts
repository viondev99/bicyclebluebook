import { Action, handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import { InfoStoreModel } from '../../model/store/info.model';
import {
  InfoPayload,
  GetUsersInfoPayload,
  GetUsersInfoSucceededPayload,
  GetUsersInfoFailedPayload,
  GetStoresInfoPayload,
  GetStoresInfoSucceededPayload,
  GetStoresInfoFailedPayload,
  GetProductsInfoPayload,
  GetProductsInfoSucceededPayload,
  GetProductsInfoFailedPayload,
  GetStockLocationsInfoPayload,
  GetStockLocationsInfoSucceededPayload,
  GetStockLocationsInfoFailedPayload,
} from './info.action';

const INIT_STATE: InfoStoreModel = {
  userIds: [],
  usersInfo: [],
  userLoading: false,
  storeIds: [],
  storesInfo: [],
  storeLoading: false,
  productIds: [],
  productsInfo: [],
  productLoading: false,
  stockLocationIds: [],
  stockLocationsInfo: [],
  stockLocationLoading: false,
  error: '',
};

const infoReducer = handleActions<InfoStoreModel, InfoPayload>(
  {
    GET_USERS_INFO: (state, action: Action<GetUsersInfoPayload>) => {
      const ids = uniq([...state.userIds, ...action.payload]);
      return { ...state, userIds: ids, userLoading: true };
    },
    GET_USERS_INFO_SUCCEEDED: (state, action: Action<GetUsersInfoSucceededPayload>) => {
      const info = uniqBy([...state.usersInfo, ...action.payload], 'id');
      return { ...state, usersInfo: info, userLoading: false };
    },
    GET_USERS_INFO_FAILED: (state, action: Action<GetUsersInfoFailedPayload>) => {
      return { ...state, error: action.payload, userLoading: false };
    },
    GET_STORES_INFO: (state, action: Action<GetStoresInfoPayload>) => {
      const ids = uniq([...state.storeIds, ...action.payload]);
      return { ...state, storeIds: ids, storeLoading: true };
    },
    GET_STORES_INFO_SUCCEEDED: (state, action: Action<GetStoresInfoSucceededPayload>) => {
      const info = uniqBy([...state.storesInfo, ...action.payload], 'id');
      return { ...state, storesInfo: info, storeLoading: false };
    },
    GET_STORES_INFO_FAILED: (state, action: Action<GetStoresInfoFailedPayload>) => {
      return { ...state, error: action.payload, storeLoading: false };
    },
    GET_PRODUCTS_INFO: (state, action: Action<GetProductsInfoPayload>) => {
      const ids = uniq([...state.productIds, ...action.payload]);
      return { ...state, productIds: ids, productLoading: true };
    },
    GET_PRODUCTS_INFO_SUCCEEDED: (state, action: Action<GetProductsInfoSucceededPayload>) => {
      const info = uniqBy([...state.productsInfo, ...action.payload], 'masterListingId');
      return { ...state, productsInfo: info, productLoading: false };
    },
    GET_PRODUCTS_INFO_FAILED: (state, action: Action<GetProductsInfoFailedPayload>) => {
      return { ...state, error: action.payload, productLoading: false };
    },
    GET_STOCK_LOCATIONS_INFO: (state, action: Action<GetStockLocationsInfoPayload>) => {
      const ids = uniq([...state.stockLocationIds, ...action.payload]);
      return { ...state, stockLocationIds: ids, stockLocationLoading: true };
    },
    GET_STOCK_LOCATIONS_INFO_SUCCEEDED: (state, action: Action<GetStockLocationsInfoSucceededPayload>) => {
      const info = uniqBy([...state.stockLocationsInfo, ...action.payload], 'id');
      return { ...state, stockLocationsInfo: info, stockLocationLoading: false };
    },
    GET_STOCK_LOCATIONS_INFO_FAILED: (state, action: Action<GetStockLocationsInfoFailedPayload>) => {
      return { ...state, error: action.payload, stockLocationLoading: false };
    },
  },
  INIT_STATE,
  {
    prefix: 'info',
  },
);

export default infoReducer;
