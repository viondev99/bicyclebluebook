import { CreateListingDraftResponse, ListingCancelledItem } from 'model/api/account/personal/listings.model';
import { DataList } from 'model/common';
import {
  compRequest,
  ListingsResponse,
  ListingsReturnResponse,
  DetailListingListedResponse,
} from '../../../api/account/personal/listings.model';

export interface ListingsModel {
  page: number;
  size?: number;
  page_size?: number;
  sortField?: string;
  sortType?: string;
  statusMarketListing?: string;
}

export interface DeleteListingModel {
  id: string;
  isDraft?: boolean;
}

export interface ListingsReturnParamsModel {
  page: number;
  size?: number;
  sort?: string;
  page_size?: number;
  pattern?: string;
  time_end?: number;
  time_start?: number;
  storefrontIds?: string[];
  statusMarketListing?: string;
}

export interface DetailListingDraft {
  ignoreStripe?: boolean;
  isBuyerPaysSignatureFee?: boolean | string;
  listingTitle?: string;
  listingType?: string;

  addressLine: string;
  bestOffer: boolean;
  bestOfferAutoAcceptPrice: number;
  bicycleTypeId: number;
  brandName: string;
  carrierType: string;
  chargeCycles: number;
  chargerIncluded: boolean;
  cityName: string;
  compRequests: {
    compId: number;
    value: string;
  }[];
  condition: string;
  country: string;
  customCarrier: string;
  description: string;
  eBikeHours: number;
  eBikeMileage: number;
  ebikeSubtypeId: number;
  emailPaypal: string;
  expireAfterDays: number;
  flatRate: number;
  hasDiagnosticReport: boolean;
  hasKey: boolean;
  height: number;
  isAllowReturn: boolean;
  isBestOffer: boolean;
  isChangeToStripe: boolean;
  isEbike: boolean;
  isExpirable: boolean;
  isFreeShip: boolean;
  isTamperedWith: boolean;
  length: number;
  localPickupShipping: boolean;
  minimumOfferAutoAcceptPrice: number;
  modelName: string;
  needValidate: boolean;
  odometerReading: number;
  profitCalculator: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: string;
    sellingPrice: number;
    shippingFee: number;
  };
  requireInsuranceShipping: boolean;
  returnShippingPayer: string;
  returnWithinDays: number;
  salePrice: number;
  msrpPrice: number;
  serialNumber: string;
  shippingServiceId: number;
  shippingType: string;
  state: string;
  weight: number;
  width: number;
  yearName: string;
  zipCode: string;
  imageDrafts: { id: number; image: string }[];
}

export interface ListingsStoreModel {
  listings: ListingsResponse;
  listingsReturn: ListingsReturnResponse;
  listingsCancelled: DataList<ListingCancelledItem>;
  detailListingListed: DetailListingListedResponse;
  detailListingDraft?: DetailListingDraft;
  filter: ListingsModel;
  loading: boolean;
  dataCreateDraftListing: CreateListingDraftResponse;
}

export interface MarkListingModal {
  bbbValue: number;
  bicycleBrandName: string;
  bicycleId: number;
  bicycleModelName: string;
  bicycleSizeName: string;
  bicycleTypeName: string;
  bicycleYearName: number;
  chargeCycles: number;
  chargerIncluded: boolean;
  cogsPrice: number;
  condition: string;
  countTrackingView: number;
  createPo: boolean;
  createdTime: string;
  currentListedPrice: number;
  customQuote: boolean;
  dealPercent: number;
  delete: boolean;
  description: string;
  discountedPrice: number;
  eBikeHours: number;
  firstListedTime: string;
  hasDiagnosticReport: boolean;
  hasKey: boolean;
  id: number;
  imageDefault: string;
  imageDefaultId: number;
  initialListPrice: number;
  isTamperedWith: boolean;
  lastUpdate: string;
  msrpPrice: number;
  name: string;
  odometerReading: string;
  privatePartyValue: number;
  recordType: string;
  searchGuideRecommendation: string;
  sellerId: string;
  sellerIsBBB: boolean;
  serialNumber: string;
  stage: string;
  status: string;
  title: string;
  typeId: string;
  valueAdditionalComponent: number;
  valueGuidePrice: number;
}

export interface RelistSoldModal {
  bestOffer: boolean;
  countListingError: number;
  createdTime: string;
  delete: boolean;
  id: number;
  inventoryId: number;
  lastUpdate: string;
  marketPlaceConfigId: number;
  marketPlaceId: number;
  masterListingId: number;
  ownerId: string;
  paypalEmailSeller: string;
  rating: number;
  status: string;
  timeListed: string;
  trackingCount: number;
}

export interface MyListingModel {
  done: string;
  postingTime: string;
  title: string;
  statusMarketListing: string;
  currentListedPrice: number;
  imageDefault: string;
  statusMessage: string;
  bestOffer: boolean;
  draft?: string;
}

export interface CreateListingModel {
  bicycleTypeId: number;
  brandName: string;
  carrierType: string;
  compRequests: compRequest[];
  condition: string;
  country: string;
  customCarrier: string;
  description: string;
  eBikeHours: string;
  eBikeMileage: string;
  emailPaypal: string;
  expireAfterDays: string;
  flatRate: number;
  hasDiagnosticReport: boolean;
  hasKey: boolean;
  isAllowReturn: boolean;
  isBestOffer: boolean;
  isEbike: boolean;
  isExpirable: boolean;
  isTamperedWith: boolean;
  localPickupShipping: boolean;
  minimumOfferAutoAcceptPrice: number;
  modelName: string;
  odometerReading: string;
  length: number;
  width: number;
  weight: number;
  height: number;
  bestOfferAutoAcceptPrice: number | null;
  cityName: string;
  addressLine: string;
  isFreeShip: boolean;
  needValidate: boolean;
  profitCalculator: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: string;
    sellingPrice: number;
    shippingFee: number;
  };
  requireInsuranceShipping: boolean;
  returnShippingPayer: string;
  returnWithinDays: number;
  salePrice: number;
  serialNumber: string;
  shippingType: string;
  state: string;
  yearName: string;
  zipCode: string;
}
