import { call, put, takeLatest, takeLeading, select } from '@redux-saga/core/effects';
import { Action, ActionMeta } from 'redux-actions';
import * as marketplaceApi from 'api/marketplace.api';
import { MarketType, StatusMarketListing } from 'constants/marketplace';
import { DataList, Product } from 'model/common';
import { getMessageFromError } from 'helpers/common.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { BBB_STAFF, ONLINE_STORE } from 'helpers/string.helper';
import Router from 'next/router';
import StoreState from 'model/store';
import marketplaceAction, { GetDetailMeta, GetOffersDetailResponse, GetProductsPayload } from './marketplace.action';
import * as favoriteActions from '../account/personal/favorites/favorites.action';

function* handleGetMarketplace(action: Action<GetProductsPayload>) {
  try {
    const { payload } = action;
    const state = yield select();
    const sortType = payload.sort.startsWith('-') ? 'DESC' : 'ASC';
    const sortField = payload.sort.replace('-', '');
    const priceRanges = payload.priceRanges.map((i) => {
      const [start, end] = i.split('-');
      return {
        startPrice: +start,
        endPrice: +end,
      };
    });
    let bodyRequest: marketplaceApi.GetmarketPlaceRequest = {
      brandIds: payload.brand,
      brakeTypeNames: payload.brakeType,
      conditions: payload.condition,
      content: payload.content,
      endPrice: payload.endPrice,
      startPrice: payload.startPrice,
      endYearId: payload.endYear,
      startYearId: payload.startYear,
      familyNames: payload.family,
      frameMaterialNames: payload.frameMaterial,
      genders: payload.gender,
      marketType: MarketType.BBB,
      statusMarketListing: StatusMarketListing.LISTED,
      latitude: payload.lat,
      longitude: payload.lng,
      page: payload.page,
      sizeNames: payload.size,
      zipCode: payload.zipCode,
      modelIds: payload.model,
      radius: payload.radius,
      size: payload.pageSize,
      sortField,
      sortType,
      priceRanges,
      wheelSizes: payload.wheelSize,
      suspensions: payload.suspension,
      typeBicycleNames: payload.type,
      sellerIsBBB: payload.sellerType === BBB_STAFF ? true : payload?.sellerIsBBB,
      sellerType: payload.sellerType !== BBB_STAFF ? payload.sellerType : '',
      sellerId: payload.sellerId ? payload.sellerId : undefined,
      storefrontId: payload.storefrontId ? payload.storefrontId : undefined,
      isComingSoon: payload.isComingSoon,
    };

    if (payload?.sellerType === ONLINE_STORE && payload?.storeName?.length > 0) {
      const listStoreFronts = state.common.listStoreFronts || [];
      bodyRequest.storefrontIds = listStoreFronts
        .filter((it: { name: string }) => payload.storeName.includes(it.name))
        .map((item: { _id: string }) => item._id);
    }

    if (payload?.listingType?.length === 1) {
      bodyRequest = {
        ...bodyRequest,
        listingType: payload?.listingType?.toString(),
      };
    }
    if (payload?.isViewSales) {
      bodyRequest = {
        ...bodyRequest,
        isViewSales: true,
      };
    }
    const response: DataList<Product> = yield call(marketplaceApi.getProduct, bodyRequest);
    yield put(marketplaceAction.getProductSucceeded(response));
  } catch (e) {
    yield put(marketplaceAction.getProductFailed(getMessageFromError(e)));
  }
}

function* handleGetDetailMarketplace(action: ActionMeta<number, GetDetailMeta>) {
  try {
    const masterListingId: number = action.payload;
    let response: Partial<Product> = {};

    if (action?.meta?.isServer) {
      response = yield call(marketplaceApi.getDetailMasterListing, masterListingId, action?.meta?.tokenFromReq);
    } else {
      response = yield call(marketplaceApi.getDetailMasterListing, masterListingId);
    }

    yield put(marketplaceAction.getDetailProductSucceeded(response));
  } catch (e) {
    yield put(marketplaceAction.getDetailProductFailed(getMessageFromError(e)));
  }
}

function* handleGetListOffersDetail(action: Action<string>) {
  try {
    const response: GetOffersDetailResponse = yield call(marketplaceApi.getListOffersDetailRequest, action.payload);
    yield put(marketplaceAction.getListOffersDetailSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(marketplaceAction.getListOffersDetailFailed(getMessageFromError(e)));
  }
}

function* handleAddToFavourite(action: Action<marketplaceApi.PayloadAddToFavourite>) {
  try {
    yield call(marketplaceApi.addToFavourite, action.payload);
    yield put(marketplaceAction.addToFavouriteSucceeded(action.payload.id));
    toastSuccess(t('marketplace.addedFavorite'), t('seoTitle.success'));
  } catch (e) {
    toastError(e);
    yield put(marketplaceAction.addToFavouriteFailed(action.payload.id));
  }
}

function* handleRemoveFromFavourite(action: Action<number>) {
  const { payload: id } = action;
  try {
    if (Router.pathname.includes('myfavorites')) {
      const queryParams = yield select((store: StoreState) => store.account.personal.favorites.queryParams);
      yield call(marketplaceApi.removeFromFavourite, id);
      yield put(marketplaceAction.removeFromFavouriteSucceeded(id));
      toastSuccess(t('marketplace.removedFavorite'), t('seoTitle.success'));
      yield put(favoriteActions.getListFavorites(queryParams));
      return;
    }
    yield call(marketplaceApi.removeFromFavourite, id);
    yield put(marketplaceAction.removeFromFavouriteSucceeded(id));
    toastSuccess(t('marketplace.removedFavorite'), t('seoTitle.success'));
  } catch (e) {
    toastError(e);
    yield put(marketplaceAction.removeFromFavouriteSucceeded(id));
  }
}

export default function* marketplaceSaga() {
  yield takeLatest(marketplaceAction.getProducts, handleGetMarketplace);
  yield takeLatest(marketplaceAction.getDetailProduct, handleGetDetailMarketplace);
  yield takeLeading(marketplaceAction.addToFavourite, handleAddToFavourite);
  yield takeLeading(marketplaceAction.removeFromFavourite, handleRemoveFromFavourite);
  yield takeLatest(marketplaceAction.getListOffersDetail, handleGetListOffersDetail);
}
