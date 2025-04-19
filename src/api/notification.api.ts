import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import { checkExistLocalStorage, checkNotifcationIsPartner } from 'helpers/utilities.helper';
import { DataList } from 'model/common';
import {
  ListingTemplateKey,
  MessageTemplateKey,
  OfferTemplateKey,
  OrderTemplateKey,
  PurchaseTemplateKey,
  ReturnRefundTemplateKey,
  WishlistTemplateKey,
  TradeInTemplateKey,
} from './../model/store/notification.model';

interface GetNotificationParams {
  page: number;
  pageSize: number;
  sort: string;
  where?: string;
  templateKeys?: Array<string>;
}

export interface NotificationItem {
  _id: string;
  title: string;
  content: string;
  template_key:
    | ListingTemplateKey
    | MessageTemplateKey
    | OfferTemplateKey
    | OrderTemplateKey
    | PurchaseTemplateKey
    | ReturnRefundTemplateKey
    | WishlistTemplateKey
    | TradeInTemplateKey;
  is_read: boolean;
  master_listing?: number;
  order?: string;
  offer?: string;
  inventory?: string;
  market_listing?: string;
  conversation?: string;
  members: Array<string>;
  date_created: string;
  date_updated: string;
}

export type GetNotificationResponse = DataList<NotificationItem> & {
  next: string;
  previous: string;
  total_unread: number;
};

export function getNotification(
  params: GetNotificationParams,
  isPartner?: boolean,
): PromiseWithCancel<GetNotificationResponse> {
  const url = isPartner ? `notify/api/v1/channel/list` : `notify/api/v1/alert`;
  let _params: any = {
    page: params.page,
    page_size: params.pageSize,
    sort: params.sort,
    where: params.where,
    template_keys: params.templateKeys ? params.templateKeys.join(',') : undefined,
  };
  if (isPartner) {
    _params = {
      ..._params,
      type: 'partner',
    };
  }
  return authorizedRequest.get<GetNotificationResponse>(url, {
    params: _params,
  });
}

export function markAsReadNotification(id: string): PromiseWithCancel<void> {
  const url = checkNotifcationIsPartner() ? `notify/api/v1/channel/${id}` : `notify/api/v1/alert/detail/${id}`;
  return authorizedRequest.get(url);
}

export function removeCursorNotification(id: string, isPartner: boolean): PromiseWithCancel<void> {
  const url = isPartner ? `notify/api/v1/channel/${id}/un-subscriber` : `notify/api/v1/alert/${id}`;
  if (isPartner) {
    return authorizedRequest.patch(url);
  }
  return authorizedRequest.delete(url);
}
