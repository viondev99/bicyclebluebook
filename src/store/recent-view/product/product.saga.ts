import { call, put, select, takeLatest } from 'redux-saga/effects';
import uniqBy from 'lodash/uniqBy';
import { Action } from 'redux-actions';

import { getProductRecentView, ProductRecentViewResponse } from 'api/recent-view/product/product.api';
import { getMessageFromError } from 'helpers/common.helper';
import * as productRecentViewActions from './product.action';

function* getProductRecentViews(action: Action<productRecentViewActions.GetProductRecentViewsPayload>) {
  try {
    const { token } = (yield select()).authenticate;
    const response: ProductRecentViewResponse[] = yield call(getProductRecentView, action.payload, token);
    const payload: productRecentViewActions.GetProductRecentViewsSuccessPayload = uniqBy(
      response,
      'masterListingId',
    ).map((item) => ({
      bicycleTypeName: item.bicycleTypeName,
      initialListPrice: item.initialListPrice,
      currentListedPrice: item.currentListedPrice,
      discountedPrice: item.discountedPrice,
      inventoryId: item.inventoryId,
      inventoryName: item.inventoryTitle,
      masterListingId: item.masterListingId,
      imageDefault: item.imageDefault,
      type: item.type,
      favourite: item.favourite,
      sellerIsBBB: item.sellerIsBBB,
    }));
    yield put(productRecentViewActions.getProductRecentViewsSucceeded(payload));
  } catch (e) {
    yield put(productRecentViewActions.getProductRecentViewsFailed(getMessageFromError(e)));
  }
}

function* addProductRecentView(action: Action<productRecentViewActions.AddProductRecentViewPayload>) {
  try {
    const { token } = (yield select()).authenticate;
    const { productRecentViews } = (yield select()).recentView.product;
    let list = [...productRecentViews];
    if (list && list.length === 0 && sessionStorage) {
      list = JSON.parse(sessionStorage?.getItem('productRecentViews'));
    }
    list = list ? list.filter((item) => item.id !== action.payload.id) : [];

    if (token) {
      if (sessionStorage) {
        sessionStorage.removeItem('productRecentViews');
      }
      yield put(productRecentViewActions.removeProductRecentViews());
    } else {
      if (sessionStorage) {
        sessionStorage.setItem('productRecentViews', JSON.stringify([action.payload, ...list]));
      }
      yield put(productRecentViewActions.addProductRecentViewSucceeded([action.payload, ...list]));
    }
    yield put(productRecentViewActions.getProductRecentViews([action.payload, ...list]));
  } catch (e) {
    yield put(productRecentViewActions.addProductRecentViewFailed(getMessageFromError(e)));
  }
}

export default function* productRecentViewSaga() {
  yield takeLatest(productRecentViewActions.getProductRecentViews, getProductRecentViews);
  yield takeLatest(productRecentViewActions.addProductRecentView, addProductRecentView);
}
