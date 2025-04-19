import { select, call, put, takeLatest } from 'redux-saga/effects';
import { Action } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  getUsersBasicInfo,
  getStoresBasicInfo,
  getProductsBasicInfo,
  getStockLocationInfo,
  UserBasicInfoResponse,
  StoreBasicInfoResponse,
  ProductsBasicInfoResponse,
  StockLocationsInfoResponse,
} from 'api/info.api';
import { toastError } from 'helpers/utils.helper';
import { getMessageFromError } from 'helpers/common.helper';
import * as infoActions from './info.action';
import StoreState from '../../model/store';
import { Product } from '../../model/common';
import { UserBasicInfoModel, StockLocationInfoModel } from '../../model/store/info.model';

function* getUsersInfo(action: Action<infoActions.GetUsersInfoPayload>) {
  try {
    const { userIds, usersInfo }: { userIds: String[]; usersInfo: UserBasicInfoModel[] } = yield select(
      (store: StoreState) => store.info,
    );
    const ids = uniq([...userIds, ...action.payload]).filter(
      (item) => !usersInfo.find((user) => user.id === item) && item,
    );
    const response: UserBasicInfoResponse = yield call(getUsersBasicInfo, ids);
    const payload: UserBasicInfoModel[] = response.map((item) => ({
      id: item._id,
      name: item.user_name || item.display_name,
      userName: item.user_name || '',
      displayName: item.display_name || '',
      avatar: item.avatar,
      gravatar: item.gravatar,
      is_bbb_user: item.is_bbb_user,
    }));
    yield put(infoActions.getUsersInfoSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(infoActions.getUsersInfoFailed(getMessageFromError(e)));
  }
}

function* getStoresInfo(action: Action<infoActions.GetStoresInfoPayload>) {
  try {
    const { storeIds, storesInfo }: { storeIds: String[]; storesInfo: UserBasicInfoModel[] } = yield select(
      (store: StoreState) => store.info,
    );
    const ids = uniq([...storeIds, ...action.payload]).filter(
      (item) => !storesInfo.find((store) => store.id === item) && item,
    );
    const response: StoreBasicInfoResponse = yield call(getStoresBasicInfo, ids);
    const payload: UserBasicInfoModel[] = response.map((item) => ({
      id: item._id,
      name: item.name,
      avatar: item.logo,
      is_bbb_store: item.is_bbb_store,
      is_bbb_store_created: item.is_bbb_store_created,
    }));
    yield put(infoActions.getStoresInfoSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(infoActions.getStoresInfoFailed(getMessageFromError(e)));
  }
}

function* getProductsInfo(action: Action<infoActions.GetProductsInfoPayload>) {
  try {
    const { productIds, productsInfo }: { productIds: Number[]; productsInfo: Partial<Product>[] } = yield select(
      (store: StoreState) => store.info,
    );
    const ids = uniq([...productIds, ...action.payload]).filter(
      (item) => !productsInfo.find((product) => product.masterListingId === item) && item,
    );
    const response: ProductsBasicInfoResponse = yield call(getProductsBasicInfo, ids);
    const payload: Partial<Product>[] = response.map((item) => ({
      masterListingId: item.masterListingId,
      bicycleName: item.bicycleName,
      imageDefault: item.imageDefault,
      currentListedPrice: item.currentListedPrice,
      bicycleTypeName: item.bicycleTypeName,
      bicycleSizeName: item.bicycleSizeName,
      bicycleModelName: item.bicycleModelName,
      bicycleBrandName: item.bicycleBrandName,
      frameSize: item.frameSize,
      frameMaterialName: item.frameMaterialName,
      wheelSizeName: item.wheelSize,
      suspensionName: item.suspension,
      condition: item.condition,
      brakeName: item.brakeName,
      genderName: item.gender,
    }));
    yield put(infoActions.getProductsInfoSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(infoActions.getProductsInfoFailed(getMessageFromError(e)));
  }
}

function* getStockLocationsInfo(action: Action<infoActions.GetStockLocationsInfoPayload>) {
  try {
    const {
      stockLocationIds,
      stockLocationsInfo,
    }: { stockLocationIds: String[]; stockLocationsInfo: StockLocationInfoModel[] } = yield select(
      (store: StoreState) => store.info,
    );
    const ids = uniq([...stockLocationIds, ...action.payload]).filter(
      (item) => !stockLocationsInfo.find((stockLocation) => stockLocation.id === item) && item,
    );
    const response: StockLocationsInfoResponse = yield call(getStockLocationInfo, ids);
    const payload: StockLocationInfoModel[] = response.map((item) => ({
      id: item._id,
      name: item.name,
      locationName: item.location_name,
      warehouse: item.warehouse,
    }));
    yield put(infoActions.getStockLocationsInfoSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(infoActions.getStockLocationsInfoFailed(getMessageFromError(e)));
  }
}

export default function* infoSaga() {
  yield takeLatest(infoActions.getUsersInfo, getUsersInfo);
  yield takeLatest(infoActions.getStoresInfo, getStoresInfo);
  yield takeLatest(infoActions.getProductsInfo, getProductsInfo);
  yield takeLatest(infoActions.getStockLocationsInfo, getStockLocationsInfo);
}
