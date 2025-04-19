import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { toastError } from 'helpers/utils.helper';
import { getDetailOrder, getOrderByCustomer, getOrders } from 'api/store-front/order.api';
import { getMessageFromError } from 'helpers/common.helper';
import { DataList } from 'model/common';
import { OrderModel } from 'model/api/store-front/order.model';
import * as orderActions from './orders.action';

function* handleGetOrders(action: Action<orderActions.GetOrdersPayload>) {
  try {
    const params: orderActions.GetOrdersPayload = {
      page: action.payload.page || 1,
      sort: action.payload.sort || 'date_finish:-1',
      page_size: action.payload.page_size || 10,
      time_end: action.payload.time_end,
      time_start: action.payload.time_start,
      search: action.payload.search,
      status: action.payload.status,
      storefrontIds: action?.payload?.storefrontIds,
    };
    const response: orderActions.GetOrdersSuccessPayload = yield call(getOrders, params);
    yield put(orderActions.getOrdersSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getOrdersFailed(getMessageFromError(e)));
  }
}

function* handleGetDetailOrder(action: Action<orderActions.GetDetailOrderPayload>) {
  try {
    const response = yield call(getDetailOrder, action.payload);
    yield put(orderActions.getDetailOrderSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getDetailOrderFailed(getMessageFromError(e)));
  }
}

function* handleGetBuyerOrders(action: Action<orderActions.GetBuyerOrdersPayload>) {
  try {
    const response = yield call(getOrderByCustomer, action.payload);
    yield put(orderActions.getBuyerOrdersSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getBuyerOrdersFailed(getMessageFromError(e)));
  }
}

export default function* sagas() {
  yield takeLatest(orderActions.getOrders, handleGetOrders);
  yield takeLatest(orderActions.getDetailOrder, handleGetDetailOrder);
  yield takeLatest(orderActions.getBuyerOrders, handleGetBuyerOrders);
}
