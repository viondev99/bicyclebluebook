import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import Router from 'next/router';
import { getMessageFromError } from 'helpers/common.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import {
  getNotification,
  GetNotificationResponse,
  markAsReadNotification,
  removeCursorNotification,
} from 'api/notification.api';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import * as notificationActions from './notification.action';

function* getNotificationsSaga(action: Action<notificationActions.GetNotificationsPayload>) {
  try {
    // const isPartner = Router?.router?.asPath.includes(`/trade-in-account`);
    const isPartner: boolean = checkExistLocalStorage()
      ? localStorage?.getItem('CHECK_ROLE_NOTIFICATION') === 'PARTNER'
      : false;
    const response: GetNotificationResponse = yield call(
      getNotification,
      {
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        sort: action.payload.sort,
        where: action.payload.where,
      },
      isPartner,
    );
    const data: notificationActions.GetNotificationsSucceededPayload = {
      data: response.data.map((item) => ({
        id: item._id,
        title: item.title || '',
        content: item.content || '',
        templateKey: item.template_key,
        members: item.members || [],
        masterListingId: item.master_listing,
        orderId: item.order,
        offerId: item.offer,
        inventoryId: item.inventory,
        marketListingId: item.market_listing,
        conversation: item.conversation,
        read: item.is_read || false,
        dateCreated: item.date_created,
        dateUpdated: item.date_updated,
      })),
      unread: response.total_unread,
      totalPage: response.total_page,
    };
    yield put(notificationActions.getNotificationsSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(notificationActions.getNotificationsFailed(getMessageFromError(e)));
  }
}

function* getListNotificationsSaga(action: Action<notificationActions.GetNotificationsPayload>) {
  try {
    // const isPartner = action?.payload?.isPartner || Router?.router?.asPath.includes(`/trade-in-account`);
    const isPartner: boolean = checkExistLocalStorage()
      ? localStorage?.getItem('CHECK_ROLE_NOTIFICATION') === 'PARTNER'
      : false;
    const response: GetNotificationResponse = yield call(
      getNotification,
      {
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        sort: action.payload.sort,
        where: action.payload.where,
        templateKeys: action.payload.templateKeys,
      },
      isPartner,
    );
    const data: notificationActions.GetNotificationsSucceededPayload = {
      data: response.data.map((item) => ({
        id: item._id,
        title: item.title || '',
        content: item.content || '',
        templateKey: item.template_key,
        members: item.members || [],
        masterListingId: item.master_listing,
        orderId: item.order,
        offerId: item.offer,
        inventoryId: item.inventory,
        marketListingId: item.market_listing,
        conversation: item.conversation,
        read: item.is_read || false,
        dateCreated: item.date_created,
        dateUpdated: item.date_updated,
      })),
      unread: response.total_unread,
      totalPage: response.total_page,
    };
    yield put(notificationActions.getListNotificationsSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(notificationActions.getListNotificationsFailed(getMessageFromError(e)));
  }
}

function* markAsReadNotificationSaga(action: Action<notificationActions.MarkAsReadNotificationPayload>) {
  try {
    yield call(markAsReadNotification, action.payload);
    yield put(notificationActions.markAsReadNotificationSucceeded(action.payload));
  } catch (e) {
    yield put(notificationActions.markAsReadNotificationFailed(getMessageFromError(e)));
  }
}

function* removeCursorNotificationSaga(action: Action<notificationActions.RemoveCursorNotification>) {
  try {
    const params: notificationActions.GetNotificationsPayload = {
      page: 1,
      pageSize: 5,
      sort: 'date_created:-1',
    };
    const isPartner: boolean = checkExistLocalStorage()
      ? localStorage?.getItem('CHECK_ROLE_NOTIFICATION') === 'PARTNER'
      : false;
    yield call(removeCursorNotification, action.payload, isPartner);
    yield put(notificationActions.getNotifications(params));
    yield put(notificationActions.getListNotifications(params));
    toastSuccess(`Remove notify successfully.`);
  } catch (e) {
    toastError(e);
  }
}

export default function* notificationSaga() {
  yield takeLatest(notificationActions.getNotifications, getNotificationsSaga);
  yield takeLatest(notificationActions.getListNotifications, getListNotificationsSaga);
  yield takeLatest(notificationActions.markAsReadNotification, markAsReadNotificationSaga);
  yield takeLatest(notificationActions.removeCursorNotification, removeCursorNotificationSaga);
}
