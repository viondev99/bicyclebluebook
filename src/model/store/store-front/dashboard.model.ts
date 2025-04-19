import { TimelineRecommendation } from 'api/store-front/dashboard.api';
import { GetUnreadAndTotalMessageFilterResponse } from 'store/store-front/dashboard/dashboard.action';

export interface StorefrontSummaryModel {
  totalSales: number;
  awaitingShipment: number;
  listings: {
    sold: number;
    forSale: number;
    expired: number;
    draft: number;
  };
  openOffers: number;
  messages: {
    unread: number;
    total: number;
  };
}

export interface StorefrontChartModel {
  date: string;
  sale: number;
}

export enum ActivityAgent {
  MASTER_LISTING = 'master_listing',
  MARKET_LISTING = 'market_listing',
  OFFER = 'offer',
  SHIPPING = 'shipping',
  MESSAGE = 'message',
}

export enum ActivityListingAction {
  CREATE = 'create',
  EDIT = 'edit',
  DELETED = 'deleted',
  RE_LIST = 're_list',
  RENEW = 'renew',
  EXPIRED = 'expired',
  SOLD = 'sold',
  REVIEW = 'review',
}

export enum ActivityOfferAction {
  MAKE = 'make',
  COUNTER = 'counter',
  ACCEPT = 'accept',
  CANCEL = 'cancel',
  REJECT = 'reject',
  EXPIRED = 'expired',
  AUTO_ACCEPT = 'auto_accept',
  COMPLETE = 'complete',
  REMOVE = 'remove_offer',
}

export enum ActivityShippingAction {
  SHIPPED = 'shipped',
}

export enum ActivityMessageAction {
  MESSAGE = 'message',
}

export interface StorefrontActivityModel {
  id: string;
  agent: ActivityAgent;
  action: ActivityListingAction | ActivityOfferAction | ActivityShippingAction | ActivityMessageAction;
  masterListing?: number;
  master_listing?: number;
  createdBy: string;
  dateCreated: string;
  dateUpdated: string;
  data: {
    name: string;
  };
}

export interface StorefrontDashboardStoreModel {
  summary?: StorefrontSummaryModel;
  chart: StorefrontChartModel[];
  timelineRecommendation: TimelineRecommendation;
  totalSales: number;
  activity: {
    data: StorefrontActivityModel[];
    dataActivity?: StorefrontActivityModel[];
    totalItem: number;
    totalPage: number;
    loading: boolean;
  };
  loading: boolean;
  dataUnreadAndTotalMessageCardDashboard?: GetUnreadAndTotalMessageFilterResponse;
}
