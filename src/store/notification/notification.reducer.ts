import { Action, handleActions } from 'redux-actions';

import { NotificationStoreModel } from 'model/store/notification.model';
import {
  NotificationPayload,
  GetNotificationsSucceededPayload,
  GetNotificationsFailedPayload,
  MarkAsReadNotificationSucceededPayload,
  MarkAsReadNotificationFailedPayload,
} from './notification.action';

const INIT_STATE: NotificationStoreModel = {
  data: [],
  list: [],
  unread: 0,
  next: '',
  previous: '',
  totalPage: 0,
  error: '',
  loading: true,
};

const notificationReducer = handleActions<NotificationStoreModel, NotificationPayload>(
  {
    GET_NOTIFICATIONS: (state) => {
      return {
        ...state,
        error: '',
        data: [],
        unread: 0,
        totalPage: 0,
        loading: true,
      };
    },
    GET_NOTIFICATIONS_SUCCEEDED: (state, action: Action<GetNotificationsSucceededPayload>) => {
      return {
        ...state,
        data: action.payload.data,
        unread: action.payload.unread,
        totalPage: action.payload.totalPage,
        loading: false,
      };
    },
    GET_NOTIFICATIONS_FAILED: (state, action: Action<GetNotificationsFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
    GET_LIST_NOTIFICATIONS: (state) => {
      return {
        ...state,
        error: '',
        loading: true,
      };
    },
    GET_LIST_NOTIFICATIONS_SUCCEEDED: (state, action: Action<GetNotificationsSucceededPayload>) => {
      return {
        ...state,
        list: action.payload.data,
        unread: action.payload.unread,
        next: action.payload.next || '',
        previous: action.payload.previous || '',
        totalPage: action.payload.totalPage,
        loading: false,
      };
    },
    GET_LIST_NOTIFICATIONS_FAILED: (state, action: Action<GetNotificationsFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },
    MARK_AS_READ_NOTIFICATION: (state) => {
      return { ...state };
    },
    MARK_AS_READ_NOTIFICATION_SUCCEEDED: (state, action: Action<MarkAsReadNotificationSucceededPayload>) => {
      return {
        ...state,
        data: state.data.map((item) => {
          if (item.id === action.payload) {
            return { ...item, read: true };
          } else {
            return item;
          }
        }),
        list: state.list.map((item) => {
          if (item.id === action.payload) {
            return { ...item, read: true };
          } else {
            return item;
          }
        }),
        read:
          !state.data.find((item) => item.id === action.payload)?.read ||
          !state.list.find((item) => item.id === action.payload)?.read
            ? state.unread - 1
            : state.unread,
      };
    },
    MARK_AS_READ_NOTIFICATION_FAILED: (state, action: Action<MarkAsReadNotificationFailedPayload>) => {
      return {
        ...state,
        error: action.payload,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'notification',
  },
);

export default notificationReducer;
