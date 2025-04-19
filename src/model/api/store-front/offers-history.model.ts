import { DataList } from '../../common';

export interface GetOfferHistoryModel {
  sort?: string;
  fieldSort?: string;
  page?: number;
  size?: number;
  content?: string;
  statuses?: string;
  fromDay?: number;
  toDay?: number;
  storefrontIds?: string[];
}

export interface GetOfferSummaryModel {
  storefrontIds?: string[];
}

export interface OfferHistoryModel {
  buyerId: string;
  createdTime: Date;
  currentListedPrice: number;
  frameSize: string;
  id: number;
  imageDefault: string;
  inventoryId: number;
  inventoryName: string;
  lastUpdate: string;
  masterListingId: number;
  offerPrice: number;
  quantity: number;
  sellerId: string;
  status: string;
  title: string;
  inventoryAuctionId?: string;
  storefrontId?: string;
  listingAge?: number;
  leftTimeExpire?: string;
  margin?: number;
  inventoryType?: string;
  cogsPrice: number;
  profit?: {
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    shippingFee: number;
  };
  marketPlaceName?: string;
  marketPlaceType?: string;
}

export type OffersHistoryResponse = DataList<OfferHistoryModel>;
