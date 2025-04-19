import { PromiseWithCancel } from '../../../helpers/request/request';
import authorizedRequest from '../../../helpers/request/authorizedRequest';
import {
  OfferMailKey,
  MessageMailKey,
  WishlistMailKey,
  SpecialOfferMailKey,
  ItemMailKey,
} from '../../../model/store/account/personal/notification.model';

export interface NotificationSettingResponse {
  _id: string;
  user: string;
  email: string;
  role: string;
  group_role: string;
  create_type: string;
  date_created: string;
  date_updated: string;
  mail_config: {
    mail_key: Array<ItemMailKey | OfferMailKey | MessageMailKey | WishlistMailKey | SpecialOfferMailKey>;
    status: string;
  };
  push_config: {
    push_key: Array<string>;
    status: string;
  };
  sms_config: {
    sms_key: Array<string>;
    status: string;
  };
  new_master_listing: string;
  state: string;
}

export function getNotificationSetting(): PromiseWithCancel<NotificationSettingResponse> {
  return authorizedRequest.get<NotificationSettingResponse>(`notify/api/v1/setting/detail_by_user`);
}

export interface UpdateNotificationSettingBody {
  mail_config: {
    mail_key: Array<ItemMailKey | OfferMailKey | MessageMailKey | WishlistMailKey | SpecialOfferMailKey>;
  };
  new_master_listing: string;
}

export function updateNotificationSetting(
  id: string,
  body: UpdateNotificationSettingBody,
): PromiseWithCancel<NotificationSettingResponse> {
  return authorizedRequest.put<NotificationSettingResponse>(`notify/api/v1/setting/${id}`, body);
}
