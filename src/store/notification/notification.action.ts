import { createActions } from 'redux-actions';

import { NotificationModel } from 'model/store/notification.model';

export type GetNotificationsPayload = {
  page: number;
  pageSize: number;
  sort: string;
  where?: string;
  templateKeys?: Array<string>;
  isPartner?: boolean;
};

export type GetNotificationsSucceededPayload = {
  data: NotificationModel[];
  unread: number;
  next?: string;
  previous?: string;
  totalPage: number;
};

export type RemoveCursorNotification = string;

export type GetNotificationsFailedPayload = string;

export type MarkAsReadNotificationPayload = string;

export type MarkAsReadNotificationSucceededPayload = string;

export type MarkAsReadNotificationFailedPayload = string;

export type NotificationPayload =
  | GetNotificationsPayload
  | GetNotificationsSucceededPayload
  | GetNotificationsFailedPayload
  | MarkAsReadNotificationPayload
  | MarkAsReadNotificationSucceededPayload
  | MarkAsReadNotificationFailedPayload;

export const {
  getNotifications,
  getNotificationsSucceeded,
  getNotificationsFailed,
  getListNotifications,
  getListNotificationsSucceeded,
  getListNotificationsFailed,
  markAsReadNotification,
  markAsReadNotificationSucceeded,
  markAsReadNotificationFailed,
  removeCursorNotification,
  removeCursorNotificationSucceeded,
  removeCursorNotificationFailed,
} = createActions<NotificationPayload>(
  {
    GET_NOTIFICATIONS: (payload: GetNotificationsPayload) => payload,
    GET_NOTIFICATIONS_SUCCEEDED: (payload: GetNotificationsSucceededPayload) => payload,
    GET_NOTIFICATIONS_FAILED: (payload: GetNotificationsFailedPayload) => payload,
    GET_LIST_NOTIFICATIONS: (payload: GetNotificationsPayload) => payload,
    GET_LIST_NOTIFICATIONS_SUCCEEDED: (payload: GetNotificationsSucceededPayload) => payload,
    GET_LIST_NOTIFICATIONS_FAILED: (payload: GetNotificationsFailedPayload) => payload,
    MARK_AS_READ_NOTIFICATION: (payload: MarkAsReadNotificationPayload) => payload,
    MARK_AS_READ_NOTIFICATION_SUCCEEDED: (payload: MarkAsReadNotificationSucceededPayload) => payload,
    MARK_AS_READ_NOTIFICATION_FAILED: (payload: MarkAsReadNotificationFailedPayload) => payload,
    REMOVE_CURSOR_NOTIFICATION: (payload: string) => payload,
    REMOVE_CURSOR_NOTIFICATION_SUCCEEDED: null,
    REMOVE_CURSOR_NOTIFICATION_FAILED: null,
  },
  {
    prefix: 'notification',
  },
);
