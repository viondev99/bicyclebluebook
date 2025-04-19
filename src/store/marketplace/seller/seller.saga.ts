import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { getStoreInfo, getUserInfo } from 'api/common.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { getMessageFromError } from 'helpers/common.helper';
import * as sellerAction from './seller.action';

function* handleGetOnlineStoreInfo(action: Action<string>) {
  try {
    const response = yield call(getStoreInfo, action.payload);
    yield put(sellerAction.getOnlineStoreInfoSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(sellerAction.getOnlineStoreInfoFailed(getMessageFromError(e)));
  }
}
function* handleGetSellerInfo(action: Action<string>) {
  try {
    const response = yield call(getUserInfo, action.payload);
    yield put(sellerAction.getSellerInfoSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(sellerAction.getSellerInfoFailed(getMessageFromError(e)));
  }
}

export default function* sellerSaga() {
  yield takeLatest(sellerAction.getOnlineStoreInfo, handleGetOnlineStoreInfo);
  yield takeLatest(sellerAction.getSellerInfo, handleGetSellerInfo);
}
