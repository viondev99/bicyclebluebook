import { createActions } from 'redux-actions';

import {
  StorefrontSummaryModel,
  StorefrontChartModel,
  StorefrontActivityModel,
} from 'model/store/store-front/dashboard.model';
import { FromDateToDateUnix, TimelineRecommendation } from 'api/store-front/dashboard.api';

export type GetStorefrontSummarySucceededPayload = Partial<StorefrontSummaryModel>;

export type GetStorefrontChartPayload = {
  type: 'day' | 'month';
  month?: string;
  fromDay?: string;
  toDay?: string;
  storefrontIds?: string[];
};

export type GetStorefrontTotalSalesPayload = {
  type: 'day' | 'month';
  month?: string;
  fromDay?: string;
  toDay?: string;
  storefrontIds?: string[];
};

export type GetStorefrontTotalSalesSucceededPayload = {
  totalSales: number;
};

export type GetStorefrontChartSucceededPayload = {
  chart: StorefrontChartModel[];
  totalSales: number;
  timelineRecommendation?: TimelineRecommendation;
};

export type GetStorefrontActivitiesPayload = {
  page: number;
  pageSize: number;
  sort: string;
  where: string;
};

export type GetStorefrontActivitiesSucceededPayload = {
  data: StorefrontActivityModel[];
  dataActivity?: StorefrontActivityModel[];
  totalItem?: number;
  totalPage?: number;
};

export type GetUnreadAndTotalMessageFilterParams = {
  filter: string;
  storefrontIds?: string[];
};

export interface GetUnreadAndTotalMessageFilterResponse {
  totalMessage: number;
  unreadMessage: number;
  totalSaleOnlineStore: number;
  totalAwaitingShipment: number;
  totalListingSold: number;
  totalListingForSale: number;
}

export type StorefrontDashboardPayload =
  | FromDateToDateUnix
  | GetStorefrontSummarySucceededPayload
  | GetStorefrontChartPayload
  | GetStorefrontChartSucceededPayload
  | GetStorefrontActivitiesPayload
  | GetStorefrontActivitiesSucceededPayload
  | GetUnreadAndTotalMessageFilterParams
  | GetUnreadAndTotalMessageFilterResponse;

export const {
  getStorefrontSummary,
  getStorefrontSummarySucceeded,
  getStorefrontSummaryFailed,
  getStorefrontTotalSales,
  getStorefrontTotalSalesSucceeded,
  getStorefrontTotalSalesFailed,
  getStorefrontChart,
  getStorefrontChartSucceeded,
  getStorefrontChartFailed,
  getStorefrontActivities,
  getStorefrontActivitiesSucceeded,
  getStorefrontActivitiesFailed,
  getUnreadAndTotalMessageFilter,
  getUnreadAndTotalMessageFilterSucceeded,
  getUnreadAndTotalMessageFilterFailed,
} = createActions<StorefrontDashboardPayload>(
  {
    GET_STOREFRONT_SUMMARY: (payload: FromDateToDateUnix) => payload,
    GET_STOREFRONT_SUMMARY_SUCCEEDED: (payload: GetStorefrontSummarySucceededPayload) => payload,
    GET_STOREFRONT_SUMMARY_FAILED: null,
    GET_STOREFRONT_TOTAL_SALES: (payload: GetStorefrontChartPayload) => payload,
    GET_STOREFRONT_TOTAL_SALES_SUCCEEDED: (payload: GetStorefrontTotalSalesSucceededPayload) => payload,
    GET_STOREFRONT_TOTAL_SALES_FAILED: null,
    GET_STOREFRONT_CHART: (payload: GetStorefrontChartPayload) => payload,
    GET_STOREFRONT_CHART_SUCCEEDED: (payload: GetStorefrontChartSucceededPayload) => payload,
    GET_STOREFRONT_CHART_FAILED: null,
    GET_STOREFRONT_ACTIVITIES: (payload: GetStorefrontActivitiesPayload) => payload,
    GET_STOREFRONT_ACTIVITIES_SUCCEEDED: (payload: GetStorefrontActivitiesSucceededPayload) => payload,
    GET_STOREFRONT_ACTIVITIES_FAILED: null,
    GET_UNREAD_AND_TOTAL_MESSAGE_FILTER: (payload: GetUnreadAndTotalMessageFilterParams) => payload,
    GET_UNREAD_AND_TOTAL_MESSAGE_FILTER_SUCCEEDED: (payload: GetUnreadAndTotalMessageFilterResponse) => payload,
    GET_UNREAD_AND_TOTAL_MESSAGE_FILTER_FAILED: null,
  },
  {
    prefix: 'storefront-dashboard',
  },
);
