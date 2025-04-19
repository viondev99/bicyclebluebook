import { createActions } from 'redux-actions';
import { GetTokenFromServerSide, PayloadAddToFavourite } from 'api/marketplace.api';
import { DataList, Product } from '../../model/common';
import { StatusMarketListing } from '../../constants/marketplace';

export interface GetProductsPayload {
  brand: string[];
  size: string[];
  model: string[];
  type: string[];
  wheelSize: string[];
  sellerType: string;
  listingType: string[];
  family: string[];
  suspension: string[];
  gender: string[];
  condition: string[];
  frameMaterial: string[];
  brakeType: string[];
  startPrice: number;
  endPrice: number;
  startYear: number;
  endYear: number;
  lat: number;
  lng: number;
  radius: number;
  sort: string;
  page: number;
  pageSize: number;
  zipCode: number;
  content: string;
  sellerId?: string;
  storefrontId?: string;
  priceRanges?: string[];
  storeName?: string[];
  sellType?: string;
  isViewSales?: boolean;
  sellerIsBBB?: boolean;
  isComingSoon?: boolean;
}

export interface GetDetailProductSucceededPayload extends Partial<Product> {
  shipping: {
    height: number;
    isFreeShip: boolean;
    length: number;
    weight: number;
    width: number;
  };
  shippingFee: number;
  allowLocalPickup: boolean;
  status: StatusMarketListing;
  offerCount?: number;
}

export interface GetOffersDetailResponse {
  total: number;
  data: DataOffersDetail[];
  page: number;
  size: number;
}

interface DataOffersDetail {
  id: number;
  buyerId: string;
  offerPrice: number;
  status: string;
  createdTime: Date;
  lastUpdate: Date;
  masterListingId: number;
  quantity: number;
  frameSize: string;
  paid: boolean;
  buyerName?: string;
}

export type GetDetailMeta = {
  silentLoad?: boolean;
  isServer?: boolean;
  tokenFromReq?: string;
};

export type MarketplacePayload =
  | Partial<GetProductsPayload>
  | DataList<Product>
  | string
  | number
  | GetOffersDetailResponse
  | any
  | GetDetailProductSucceededPayload;

const {
  getProducts,
  getProductSucceeded,
  getProductFailed,
  getDetailProduct,
  getDetailProductSucceeded,
  getDetailProductFailed,
  addToFavourite,
  addToFavouriteSucceeded,
  addToFavouriteFailed,
  removeFromFavourite,
  removeFromFavouriteSucceeded,
  removeFromFavouriteFailed,
  getListOffersDetail,
  getListOffersDetailSucceeded,
  getListOffersDetailFailed,
  addFilter,
} = createActions<MarketplacePayload>(
  {
    GET_PRODUCTS: (payload: Partial<GetProductsPayload>) => payload,
    GET_PRODUCT_SUCCEEDED: (payload: DataList<Product>) => payload,
    GET_PRODUCT_FAILED: (message: string) => message,
    GET_DETAIL_PRODUCT: [(payload: number) => payload, (payload: number, meta: GetDetailMeta) => meta],
    GET_DETAIL_PRODUCT_SUCCEEDED: (payload: GetDetailProductSucceededPayload) => payload,
    GET_DETAIL_PRODUCT_FAILED: (message: string) => message,
    ADD_TO_FAVOURITE: (payload: PayloadAddToFavourite) => payload,
    ADD_TO_FAVOURITE_SUCCEEDED: (payload: number) => payload,
    ADD_TO_FAVOURITE_FAILED: (payload: number) => payload,
    REMOVE_FROM_FAVOURITE: (payload: number) => payload,
    REMOVE_FROM_FAVOURITE_SUCCEEDED: (payload: number) => payload,
    REMOVE_FROM_FAVOURITE_FAILED: (payload: number) => payload,
    GET_LIST_OFFERS_DETAIL: (payload: string) => payload,
    GET_LIST_OFFERS_DETAIL_SUCCEEDED: (payload: GetOffersDetailResponse) => payload,
    GET_LIST_OFFERS_DETAIL_FAILED: (payload: string) => payload,
    ADD_FILTER: (payload: any) => payload,
  },
  {
    prefix: 'marketplace',
  },
);

export default {
  getProducts,
  getProductSucceeded,
  getProductFailed,
  getDetailProduct,
  getDetailProductSucceeded,
  getDetailProductFailed,
  addToFavourite,
  addToFavouriteSucceeded,
  addToFavouriteFailed,
  removeFromFavourite,
  removeFromFavouriteSucceeded,
  removeFromFavouriteFailed,
  getListOffersDetail,
  getListOffersDetailSucceeded,
  getListOffersDetailFailed,
  addFilter,
};
