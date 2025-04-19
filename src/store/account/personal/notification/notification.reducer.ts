import { Action, handleActions } from 'redux-actions';
import { NotificationSettingStoreModel } from 'model/store/account/personal/notification.model';
import {
  NotificationSettingPayload,
  GetNotificationSettingSucceededPayload,
  UpdateNotificationSettingSucceededPayload,
} from './notification.action';

const INIT_STATE: NotificationSettingStoreModel = {
  detail: undefined,
  loading: false,
};

const notificationReducer = handleActions<NotificationSettingStoreModel, NotificationSettingPayload>(
  {
    GET_NOTIFICATION_SETTING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_NOTIFICATION_SETTING_SUCCEEDED: (state, action: Action<GetNotificationSettingSucceededPayload>) => {
      return {
        ...state,
        detail: action.payload,
        loading: false,
      };
    },
    GET_NOTIFICATION_SETTING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    UPDATE_NOTIFICATION_SETTING: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    UPDATE_NOTIFICATION_SETTING_SUCCEEDED: (state, action: Action<UpdateNotificationSettingSucceededPayload>) => {
      return {
        ...state,
        detail: action.payload,
        loading: false,
      };
    },
    UPDATE_NOTIFICATION_SETTING_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'notification',
  },
);

export default notificationReducer;
