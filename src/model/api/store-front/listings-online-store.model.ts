import { StatusMarketListing } from 'constants/marketplace';
import { DataList } from '../../common';
import { DraftListing, FinishedModel } from '../account/personal/listings.model';

export interface GetListingOnlineStoreModel {
  statuses?: StatusMarketListing;
  page?: number;
  size?: number;
  content?: string;
  fromDay?: number;
  toDay?: number;
  isAvailableAssembled?: boolean;
  soldFilter?: string;
  sortField?: string;
  sortType?: string;
  storefrontIds?: string[];
}

export interface ListingItemModel {
  bestOffer: boolean;
  currentListedPrice: number;
  finished: FinishedModel;
  imageDefault: string;
  margin: number;
  draft?: DraftListing;
  postingTime: string;
  statusMarketListing: string;
  title: string;
  trackingNumber?: string;
}

export interface TrackingNumberModel {
  id: number;
  inventoryId: number;
  trackingNumber: string;
}

export type ListingOnlineStoreResponse = DataList<ListingItemModel>;

export type TrackingNumberResponse = TrackingNumberModel[];

export interface SendTrackingMailParams {
  marketListingId: number;
  carrierType: string;
  trackingNumber: string;
}

export interface GetShipmentResponse {
  shipmentId: number;
  inventoryId: number;
  shipmentType: string;
  carrierType: string;
  trackingNumber: string;
  fullLinkLabel: string;
  isDelivered: true;
  manualCarrier?: string;
  createdTime: string;
  active: boolean;
}

export interface GetShipmentReturnResponse {
  active?: boolean;
  billingWeight?: number;
  carrierType?: string;
  createdTime?: string;
  fullLinkLabel?: string;
  id?: number;
  inventoryId?: number;
  s3PathLabel?: string;
  shipmentType?: string;
  shippingConfigId?: number;
  totalChargeCurrency?: string;
  trackingNumber?: string;
}
