import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { NotificationSettingModel } from 'model/store/account/personal/notification.model';
import { toastError } from 'helpers/utils.helper';
import {
  getNotificationSetting,
  updateNotificationSetting,
  NotificationSettingResponse,
  UpdateNotificationSettingBody,
} from 'api/account/personal/notification.api';
import StoreState from 'model/store';
import * as notificationActions from './notification.action';

function* handleGetNotification() {
  try {
    const response: NotificationSettingResponse = yield call(getNotificationSetting);
    const payload: NotificationSettingModel = {
      id: response._id,
      user: response.user,
      email: response.email,
      newMasterListing: response.new_master_listing,
      mailConfig: {
        mailKey: response.mail_config.mail_key,
        status: response.mail_config.status,
      },
      pushConfig: {
        pushKey: response.push_config.push_key,
        status: response.push_config.status,
      },
      smsConfig: {
        smsKey: response.sms_config.sms_key,
        status: response.sms_config.status,
      },
    };
    yield put(notificationActions.getNotificationSettingSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(notificationActions.getNotificationSettingFailed());
  }
}

function* handleUpdateNotification(action: Action<notificationActions.UpdateNotificationSettingPayload>) {
  try {
    const id = yield select((store: StoreState) => store.account.personal.notification?.detail?.id || '');
    const payload: UpdateNotificationSettingBody = {
      mail_config: {
        mail_key: action.payload.mailKey || [],
      },
      new_master_listing: action.payload.newMasterListing,
    };
    const response: NotificationSettingResponse = yield call(updateNotificationSetting, id, payload);
    const data: NotificationSettingModel = {
      id: response._id,
      user: response.user,
      email: response.email,
      newMasterListing: response.new_master_listing,
      mailConfig: {
        mailKey: response.mail_config.mail_key,
        status: response.mail_config.status,
      },
      pushConfig: {
        pushKey: response.push_config.push_key,
        status: response.push_config.status,
      },
      smsConfig: {
        smsKey: response.sms_config.sms_key,
        status: response.sms_config.status,
      },
    };
    yield put(notificationActions.updateNotificationSettingSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(notificationActions.updateNotificationSettingFailed());
  }
}

export default function* notificationSettingSaga() {
  yield takeLatest(notificationActions.getNotificationSetting, handleGetNotification);
  yield takeLatest(notificationActions.updateNotificationSetting, handleUpdateNotification);
}
