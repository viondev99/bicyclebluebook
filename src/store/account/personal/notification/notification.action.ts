import { createActions } from 'redux-actions';
import {
  NotificationSettingModel,
  ItemMailKey,
  MessageMailKey,
  OfferMailKey,
  SpecialOfferMailKey,
  WishlistMailKey,
} from '../../../../model/store/account/personal/notification.model';

export type GetNotificationSettingSucceededPayload = NotificationSettingModel;

export interface UpdateNotificationSettingPayload {
  mailKey: Array<ItemMailKey | MessageMailKey | OfferMailKey | SpecialOfferMailKey | WishlistMailKey>;
  newMasterListing: string;
}

export type UpdateNotificationSettingSucceededPayload = NotificationSettingModel;

export type NotificationSettingPayload =
  | GetNotificationSettingSucceededPayload
  | UpdateNotificationSettingPayload
  | UpdateNotificationSettingSucceededPayload;

export const {
  getNotificationSetting,
  getNotificationSettingSucceeded,
  getNotificationSettingFailed,
  updateNotificationSetting,
  updateNotificationSettingSucceeded,
  updateNotificationSettingFailed,
} = createActions<NotificationSettingPayload>(
  {
    GET_NOTIFICATION_SETTING: null,
    GET_NOTIFICATION_SETTING_SUCCEEDED: (payload: GetNotificationSettingSucceededPayload) => payload,
    GET_NOTIFICATION_SETTING_FAILED: null,
    UPDATE_NOTIFICATION_SETTING: (payload: UpdateNotificationSettingPayload) => payload,
    UPDATE_NOTIFICATION_SETTING_SUCCEEDED: (payload: UpdateNotificationSettingSucceededPayload) => payload,
    UPDATE_NOTIFICATION_SETTING_FAILED: null,
  },
  {
    prefix: 'notification',
  },
);
