import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import {
  getDetailOrder,
  getOrders,
  getReturnDetail,
  refundOrder,
  getComplaintsOrder,
  GetComplaintOrderResponse,
} from 'api/account/personal/order.api';
import { DataList } from 'model/common';
import { OrderDetailResponse, OrderListingResponse } from 'model/api/account/personal/orders.model';
import { ComplaintOrder } from 'model/store/account/personal/orders.model';
import { getMessageFromError } from 'helpers/common.helper';
import Router from 'next/router';
import t from 'helpers/language';
import * as orderActions from './orders.action';

function* handleGetOrders(action: Action<orderActions.GetOrdersPayload>) {
  try {
    const response: OrderListingResponse = yield call(getOrders, {
      page: action.payload.page || 1,
      sort: action.payload.sort || 'date_updated:-1',
      page_size: action.payload.page_size || 10,
    });

    yield put(orderActions.getOrdersSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getOrdersFailed(getMessageFromError(e)));
  }
}

function* handleGetDetailOrder(action: Action<orderActions.GetDetailOrderPayload>) {
  try {
    const response: OrderDetailResponse = yield call(getDetailOrder, action.payload);
    yield put(orderActions.getDetailOrderSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getDetailOrderFailed(getMessageFromError(e)));
  }
}

function* handleRefundOrder(action: Action<orderActions.RefundOrderPayload>) {
  try {
    toastSuccess(t('myAccount.order.refundSubmitted'));
    yield call(refundOrder, action.payload);
    const { replace } = Router;
    replace({
      pathname: `/account/order/${action.payload.order_id}`,
    });
  } catch (e) {
    toastError(e);
    yield put(orderActions.refundOrderFailed(getMessageFromError(e)));
  }
}

function* handleGetReturnDetail(action: Action<orderActions.GetReturnDetailPayload>) {
  try {
    const response = yield call(getReturnDetail, action.payload);
    yield put(orderActions.getReturnDetailSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getReturnDetailFailed(getMessageFromError(e)));
  }
}

function* handleGetComplaintsOrder(action: Action<orderActions.GetComplaintsOrderPayload>) {
  try {
    const payload = {
      is_seller: action.payload.isSeller,
      page: action.payload.page,
      page_size: action.payload.pageSize,
      sort: action.payload.sort,
      where: action.payload.where,
    };
    const response: DataList<GetComplaintOrderResponse> = yield call(getComplaintsOrder, payload);
    const data: ComplaintOrder[] = response.data.map((item) => ({
      id: item._id,
      buyerName: item.buyer_name,
      content: item.content,
      dateCreated: item.date_created,
      name: item.name,
      reason_case: item?.reason_case,
      send_reponses: item?.send_reponses,
    }));
    yield put(orderActions.getComplaintsOrderSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(orderActions.getComplaintsOrderFailed(getMessageFromError(e)));
  }
}

export default function* sagas() {
  yield takeLatest(orderActions.getOrders, handleGetOrders);
  yield takeLatest(orderActions.getDetailOrder, handleGetDetailOrder);
  yield takeLatest(orderActions.refundOrder, handleRefundOrder);
  yield takeLatest(orderActions.getReturnDetail, handleGetReturnDetail);
  yield takeLatest(orderActions.getComplaintsOrder, handleGetComplaintsOrder);
}
