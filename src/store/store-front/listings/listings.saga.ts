import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import {
  getListingOnlineStore,
  getInventoryShipment,
  getListingSoldOnlineStore,
  getListTrackingNumberSold,
  getShipmentReturn,
} from 'api/store-front/listings.api';
import StoreState from 'model/store/index';
import { getMessageFromError } from 'helpers/common.helper';
import { StatusMarketListing } from 'constants/marketplace';
import {
  GetListingOnlineStoreModel,
  ListingOnlineStoreResponse,
  TrackingNumberResponse,
} from 'model/api/store-front/listings-online-store.model';
import { ListingsReturnParamsModel, DeleteListingModel } from 'model/store/account/personal/listings.model';
import {
  ListingsReturnResponse,
  DeleteListingResponse,
  InventoryShipmentResponse,
} from 'model/api/account/personal/listings.model';
import {
  getListingsManagerReturn,
  deleteListing,
  deleteListingDraft,
  getCountNewReturns,
  getCountNewCancellations,
  getCountNewReturnsParams,
} from 'api/account/personal/listings.api';
import cloneDeep from 'lodash/cloneDeep';
import * as listingActions from './listings.action';

function* handleGetListings(action: Action<GetListingOnlineStoreModel>) {
  try {
    const bodyParams: GetListingOnlineStoreModel = {
      page: action.payload.page || 1,
      size: action.payload.size || 10,
      content: action.payload.content || '',
      statuses: action.payload.statuses || StatusMarketListing.LISTED,
      fromDay: action.payload.fromDay,
      toDay: action.payload.toDay,
      isAvailableAssembled: action.payload.isAvailableAssembled || null,
      storefrontIds: action?.payload?.storefrontIds,
    };
    let response: ListingOnlineStoreResponse;
    if (action.payload.statuses === StatusMarketListing.DRAFT) {
      bodyParams.sortField = 'POSTING_TIME';
      bodyParams.sortType = action.payload.sortType;
    }
    if (action.payload.statuses === StatusMarketListing.SOLD) {
      bodyParams.sortField = action.payload.sortField || 'SOLD_TIME';
      bodyParams.sortType = action.payload.sortType;
      bodyParams.soldFilter = action.payload.soldFilter !== 'all' ? action.payload.soldFilter : 'ALL';
      response = yield call(getListingSoldOnlineStore, bodyParams);
      const listInv = response?.data?.map((item) => item?.finished?.inventoryId);
      const body = {
        inventoryIds: listInv,
      };
      const listTracking: TrackingNumberResponse = yield call(getListTrackingNumberSold, body);
      const cloneResponse = cloneDeep(response);
      response = {
        ...response,
        data: cloneResponse?.data?.map((item) => {
          const trackingNumber = listTracking?.filter((e) => e?.inventoryId === item?.finished?.inventoryId);
          return {
            ...item,
            trackingNumber: trackingNumber[0]?.trackingNumber,
          };
        }),
      };
    } else {
      if (action.payload.sortField) {
        bodyParams.sortField = action.payload.sortField;
      }
      if (action.payload.sortType) {
        bodyParams.sortType = action.payload.sortType;
      }
      response = yield call(getListingOnlineStore, bodyParams);
    }
    yield put(listingActions.getListingsOnlineStoreSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getListingsOnlineStoreFailed(getMessageFromError(e)));
  }
}

function* handleGetListingsManagerReturn(action: Action<ListingsReturnParamsModel>) {
  try {
    const response: ListingsReturnResponse = yield call(getListingsManagerReturn, {
      page: action.payload.page || 1,
      size: action.payload.size || 10,
      sort: action.payload.sort || 'date_created:- 1',
      storefrontIds: action?.payload?.storefrontIds,
    });
    yield put(listingActions.getListingsReturnOnlineStoreSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getListingsReturnOnlineStoreFailed(getMessageFromError(e)));
  }
}

function* handleDeleteListings(action: Action<DeleteListingModel>) {
  try {
    let response: DeleteListingResponse;
    if (action?.payload?.isDraft) {
      response = yield call(deleteListingDraft, action.payload.id);
    } else {
      response = yield call(deleteListing, action.payload.id);
    }
    yield put(listingActions.deleteListingSucceeded(response));
    const queryParams = yield select((store: StoreState) => store.storeFront.listingOnlineStore.queryParams);
    yield put(listingActions.getListingsOnlineStore(queryParams));
    toastSuccess(t('myAccount.myListing.deleted'), t('seoTitle.success'));
  } catch (e) {
    toastError(e);
    yield put(listingActions.deleteListingFailed(getMessageFromError(e)));
  }
}

function* handleGetListInventory(action: Action<string>) {
  try {
    const response: InventoryShipmentResponse = yield call(getInventoryShipment, action.payload);
    yield put(listingActions.getInventoryShipmentSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getInventoryShipmentFailed(getMessageFromError(e)));
  }
}

function* handleGetCountNewReturns(action: Action<getCountNewReturnsParams>) {
  try {
    const response = yield call(getCountNewReturns, action.payload);
    yield put(listingActions.getCountNewReturnSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getCountNewReturnFailed(getMessageFromError(e)));
  }
}

function* handleGetCountNewCancel(action: Action<getCountNewReturnsParams>) {
  try {
    const response = yield call(getCountNewCancellations, action.payload);
    yield put(listingActions.getCountNewCancelSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getCountNewCancelFailed(getMessageFromError(e)));
  }
}

function* checkShipping(action: Action<string>) {
  try {
    const response = yield call(getShipmentReturn, action?.payload);
    yield put(listingActions.checkShippingSucceeded(response));
  } catch (e) {
    // toastError(e);
    yield put(listingActions.checkShippingFailed(getMessageFromError(e)));
  }
}

export default function* listingsOnlineStoreSaga() {
  yield takeLatest(listingActions.getListingsOnlineStore, handleGetListings);
  yield takeLatest(listingActions.getListingsReturnOnlineStore, handleGetListingsManagerReturn);
  yield takeLatest(listingActions.deleteListing, handleDeleteListings);
  yield takeLatest(listingActions.getInventoryShipment, handleGetListInventory);
  yield takeLatest(listingActions.getCountNewReturn, handleGetCountNewReturns);
  yield takeLatest(listingActions.getCountNewCancel, handleGetCountNewCancel);
  yield takeLatest(listingActions.checkShipping, checkShipping);
}
