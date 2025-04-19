import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import { DataList } from 'model/common';
import {
  ActivityListingAction,
  ActivityOfferAction,
  ActivityShippingAction,
  ActivityMessageAction,
  ActivityAgent,
} from '../../model/store/store-front/dashboard.model';

export interface GetStorefrontSummaryResponse {
  listings: {
    allListing: number;
    draft: number;
    expired: number;
    forSale: number;
    salePending: number;
    sold: {
      allSold: number;
      awaitingShipment: number;
    };
  };
  openOffers: number;
  storefrontId: string;
}

interface StartDateEndDate {
  startDate?: string | number;
  endDate?: string | number;
  storefrontIds?: string[];
}

export interface FromDateToDateUnix {
  fromDate?: string | number;
  toDate?: string | number;
  storefrontIds?: string[];
}

export function getStorefrontSummary(params?: FromDateToDateUnix): PromiseWithCancel<GetStorefrontSummaryResponse> {
  return authorizedRequest.get<GetStorefrontSummaryResponse>(`core/api/onlineStore/summary`, {
    params,
  });
}

export interface GetStorefrontTotalUnreadMessageResponse {
  unread_conversation: number;
  unread_message: number;
}

export function getStorefrontTotalUnreadMessage(
  params?: StartDateEndDate,
): PromiseWithCancel<GetStorefrontTotalUnreadMessageResponse> {
  return authorizedRequest.get<GetStorefrontTotalUnreadMessageResponse>(
    `support/api/v1/chats/conversation/total-unread`,
    {
      params,
    },
  );
}

export interface GetStorefrontTotalMessageResponse {
  total_message: number;
}

export function getStorefrontTotalMessage(
  params?: StartDateEndDate,
): PromiseWithCancel<GetStorefrontTotalMessageResponse> {
  return authorizedRequest.get<GetStorefrontTotalMessageResponse>(`support/api/v1/chats/conversation/total-message`, {
    params,
  });
}

export interface StorefrontChartItem {
  date: string;
  sale: number;
}

export interface GetStorefrontChartByDayParams {
  fromDay: string;
  toDay: string;
  storefrontIds?: string[];
}

export function getStorefrontChartByDay(
  params: GetStorefrontChartByDayParams,
): PromiseWithCancel<StorefrontChartItem[]> {
  return authorizedRequest.get<StorefrontChartItem[]>(`core/api/onlineStore/sale/detail`, {
    params: {
      fromDay: params.fromDay,
      toDay: params.toDay,
      storefrontIds: params?.storefrontIds,
    },
  });
}

export interface TimelineRecommendation {
  today: number;
  last7Days: number;
  last30Days: number;
  last90Days: number;
}
export interface GetStorefrontChartByMonthParams {
  month: string;
  storefrontIds?: string[];
}

export interface GetStorefrontChartByMonthResponse {
  days: StorefrontChartItem[];
  month: string;
  totalSale: number;
  timelineRecommendation?: TimelineRecommendation;
}

export interface GetStorefrontChartResponse {
  days: StorefrontChartItem[];
  timelineRecommendation?: TimelineRecommendation;
}

export function getStorefrontChartByMonth(
  params: GetStorefrontChartByMonthParams,
): PromiseWithCancel<GetStorefrontChartByMonthResponse> {
  return authorizedRequest.get<GetStorefrontChartByMonthResponse>(`core/api/onlineStore/sale`, {
    params: {
      month: params.month,
      storefrontIds: params?.storefrontIds,
    },
  });
}

export interface GetStorefrontActivityParams {
  where: string;
  sort: string;
  page: number;
  pageSize: number;
  storefrontIds?: string[];
}

export interface StorefrontActivityItem {
  _id: string;
  action: ActivityListingAction | ActivityOfferAction | ActivityShippingAction | ActivityMessageAction;
  agent: ActivityAgent;
  bookmarks: Array<string>;
  created_by: string;
  data: {
    name: string;
    msrpPrice?: number;
    masterListingId?: number;
    offerPrice?: number;
    bicycleSizeName?: string;
  };
  date_created: string;
  date_updated: string;
  master_listing?: number;
  offer?: string;
  members: Array<string>;
  role: string;
  stage: string;
  storefronts: Array<string>;
  total_comment: number;
  type: string;
  views: Array<string>;
  reaction: { loves: Array<string>; likes: Array<string>; dislikes: Array<string>; angers: Array<string> };
}

export type GetStorefrontActivityResponse = DataList<StorefrontActivityItem>;

export function getStorefrontActivity(
  params: GetStorefrontActivityParams,
): PromiseWithCancel<GetStorefrontActivityResponse> {
  return authorizedRequest.get<GetStorefrontActivityResponse>(`support/api/v1/chatter/activity`, {
    params: {
      where: params.where,
      sort: params.sort,
      page: params.page,
      page_size: params.pageSize,
      storefrontIds: params?.storefrontIds,
    },
  });
}
