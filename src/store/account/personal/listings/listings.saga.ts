import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import {
  ListingsResponse,
  ListingsReturnResponse,
  DeleteListingPayload,
  CreateListingDraftRequest,
  ListingCancelledItem,
  CreateListingDraftResponse,
} from 'model/api/account/personal/listings.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import {
  DetailListingDraftResponse,
  createDraftListing,
  deleteListing,
  getListings,
  getListingsManagerReturn,
  markListingAsShipped,
  patchReListSoldListing,
  deleteListingDraft,
  getDetailListingListed,
  getDetailListingDraft,
  getListingsCancelled,
} from 'api/account/personal/listings.api';
import { DataList } from 'model/common';
import { getMessageFromError } from 'helpers/common.helper';
import {
  DetailListingDraft,
  ListingsModel,
  ListingsReturnParamsModel,
} from 'model/store/account/personal/listings.model';
import { StatusMarketListing } from 'constants/marketplace';
import StoreState from 'model/store';
import * as listingActions from './listings.action';

function* handleGetListings(action: Action<ListingsModel>) {
  try {
    const bodyParams: ListingsModel = {
      page: action.payload.page || 1,
      size: action.payload.size || 10,
      statusMarketListing: action.payload.statusMarketListing || StatusMarketListing.LISTED,
    };
    let response: ListingsResponse;
    if (action.payload.statusMarketListing === StatusMarketListing.LISTED) {
      bodyParams.sortField = action.payload.sortField || 'VIEWS';
      bodyParams.sortType = action.payload.sortType || 'DESC';
      response = yield call(getListings, bodyParams);
    } else {
      response = yield call(getListings, action.payload);
    }
    yield put(listingActions.getListingsSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getListingsFailed(getMessageFromError(e)));
  }
}

function* handleDeleteListings(action: Action<DeleteListingPayload>) {
  try {
    if (action.payload.isDraft) {
      yield call(deleteListingDraft, action.payload.idDelete);
    } else {
      yield call(deleteListing, action.payload.idDelete);
    }
    yield put(listingActions.deleteListingsSucceeded());
    const currentFilter = yield select((store: StoreState) => store.account.personal.listings.filter);
    yield put(listingActions.getListings(currentFilter));
    toastSuccess(t('myAccount.myListing.deleted'), t('seoTitle.success'));
  } catch (e) {
    toastError(e);
    yield put(listingActions.deleteListingsFailed(getMessageFromError(e)));
  }
}

function* handleMarkListingAsShipped(action: Action<string>) {
  try {
    yield call(markListingAsShipped, action.payload);
    yield put(listingActions.markListingsAsShippedSucceeded());
    const currentFilter = yield select((store: StoreState) => store.account.personal.listings.filter);
    yield put(listingActions.getListings(currentFilter));
    toastSuccess(t('myAccount.myListing.markAsPickedUp'));
  } catch (e) {
    toastError(e);
    yield put(listingActions.markListingsAsShippedFailed(getMessageFromError(e)));
  }
}

function* handlePatchReListSoldListing(action: Action<string>) {
  try {
    yield call(patchReListSoldListing, action.payload);
    yield put(listingActions.patchReListSoldListingSucceeded());
    const currentFilter = yield select((store: StoreState) => store.account.personal.listings.filter);
    yield put(listingActions.getListings(currentFilter));
    toastSuccess(t('myAccount.myListing.reListed'), t('seoTitle.success'));
  } catch (e) {
    toastError(e);
    yield put(listingActions.patchReListSoldListingFailed(getMessageFromError(e)));
  }
}

function* handleGetListingsManagerReturn(action: Action<ListingsReturnParamsModel>) {
  try {
    const response: ListingsReturnResponse = yield call(getListingsManagerReturn, action.payload);
    yield put(listingActions.getListingsManagerReturnSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getListingsManagerReturnFailed(getMessageFromError(e)));
  }
}

function* handleCreateDraftListing(action: Action<CreateListingDraftRequest>) {
  try {
    const response: CreateListingDraftResponse = yield call(createDraftListing, action.payload);
    yield put(listingActions.createDraftListingSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.createDraftListingFailed(getMessageFromError(e)));
  }
}

function* handleGetDetailListingListed(action: Action<string>) {
  try {
    const response = yield call(getDetailListingListed, action.payload);
    yield put(listingActions.getDetailListingListedSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getDetailListingListedFailed(getMessageFromError(e)));
  }
}

function* handleGetDetailListingDraft(action: Action<string>) {
  try {
    const response: DetailListingDraftResponse = yield call(getDetailListingDraft, action.payload);
    const data: DetailListingDraft = {
      ...JSON.parse(response.content),
      imageDrafts: response.imageDrafts.map((item) => ({
        id: item.id,
        image: item.image,
      })),
    };
    yield put(listingActions.getDetailListingDraftSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getDetailListingDraftFailed(getMessageFromError(e)));
  }
}

function* handleGetListingsCancelled(action: Action<ListingsReturnParamsModel>) {
  try {
    const response: DataList<ListingCancelledItem> = yield call(getListingsCancelled, action.payload);
    yield put(listingActions.getListingsCancelledSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(listingActions.getListingsCancelledFailed(getMessageFromError(e)));
  }
}

export default function* listingsSaga() {
  yield takeLatest(listingActions.getListings, handleGetListings);
  yield takeLatest(listingActions.deleteListings, handleDeleteListings);
  yield takeLatest(listingActions.markListingsAsShipped, handleMarkListingAsShipped);
  yield takeLatest(listingActions.patchReListSoldListing, handlePatchReListSoldListing);
  yield takeLatest(listingActions.getListingsManagerReturn, handleGetListingsManagerReturn);
  yield takeLatest(listingActions.createDraftListing, handleCreateDraftListing);
  yield takeLatest(listingActions.getDetailListingListed, handleGetDetailListingListed);
  yield takeLatest(listingActions.getDetailListingDraft, handleGetDetailListingDraft);
  yield takeLatest(listingActions.getListingsCancelled, handleGetListingsCancelled);
}
