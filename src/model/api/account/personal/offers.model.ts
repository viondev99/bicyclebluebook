import { UpdateOfferFrom } from 'constants/offer';
import { DataList } from '../../../common';

export interface GetOfferModel {
  sort: string;
  fieldSort: string;
  page: number;
  size: number;
  id?: string;
  masterListingId?: number;
}

export interface GetOfferBikeModel {
  id: number;
  sortFile?: string;
  sortType?: string;
}

export interface OfferModel {
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
  leftTimeExpire?: string;
}

export type OffersResponse = DataList<OfferModel>;

export interface UpdateOfferModel {
  id?: string | number;
  status: string;
  offerPrice?: string;
  message?: string;
  reasonCancel?: string;
  updateFrom?: string | UpdateOfferFrom;
  typeUpdate?: string | 'counter' | 'cancel' | 'accept' | 'reject' | 'contact';
}

export interface ContactSellerModel {
  owner: string;
  members?: string[];
  types?: string;
  master_listing: 123;
  storefront?: string[];
  receiver_user_id?: string;
  receiver_store_id?: string;
}

export interface ContactSellerResponse {
  owner: string;
  members: string[];
  last_message: string;
  created_by: string;
  types: string[];
  status: boolean;
  _id: string;
  master_listing: number;
  storefront: string[];
  archive_configs: string;
  date_created: string | Date;
  date_updated: string | Date;
  unread_messages: string;
}

export interface SellerModel {
  display_name?: string;
  logo: string;
  name: string;
  _id: string;
}

export interface FrameSize {
  frameSize: string;
  totalForSale: number;
  totalSalePending: number;
  totalSold: number;
  all: number;
}

export interface DetailMasterListingModal {
  addressLine: string;
  allowLocalPickup: boolean;
  bestDeal: boolean;
  bestOfferAutoAcceptPrice: number;
  bicycleBrandName: string;
  bicycleId: number;
  bicycleModelName: string;
  bicycleName: string;
  bicycleSizeName: string;
  bicycleTypeName: string;
  bicycleYearName: string;
  brakeName: string;
  brandId: number;
  cityName: string;
  components: string;
  condition: string;
  countryCode: string;
  countryName: string;
  county: string;
  createdTime: string;
  currentListedPrice: number;
  delete: boolean;
  discountedPrice: number;
  ebayShippingProfileId: number;
  favourite: boolean;
  frameMaterialNameboolean: string;
  frameSize: string;
  frameSizes: FrameSize[];
  genderName: string;
  imageDefault: string;
  images: string[];
  initialListPrice: number;
  inventoryDescription: string;
  inventoryId: number;
  inventoryName: string;
  isBestOffer: boolean;
  location: string;
  marketListingId: number;
  marketType: string;
  masterListingId: number;
  minimumOfferAutoAcceptPrice: number;
  modelId: number;
  msrpPrice: number;
  offerCount: number;
  ratingScore: number;
  ratings: number;
  sellerId: string;
  sellerIsBBB: boolean;
  serialNumber: string;
  shipping: { isFreeShip: boolean };
  shippingFee: number;
  shippingProfileDescription: string;
  shippingProfileLabel: string;
  sizeCategoryDisplayName: string;
  stageCart: string;
  stageInventory: string;
  stateCode: string;
  stateName: string;
  status: string;
  statusInventory: string;
  timeListed: string;
  title: string;
  totalForSale: number;
  totalListings: number;
  totalSalePending: number;
  totalSold: number;
  typeInventoryName: string;
  wheelSizeName: string;
  yearId: number;
  zipCode: string;
}
export interface OfferBikeModal {
  buyerId: string;
  cogsPrice: number;
  createdTime: string;
  currentListedPrice: number;
  frameSize: string;
  id: number;
  imageDefault: string;
  inventoryId: number;
  inventoryName: string;
  inventoryType: string;
  lastUpdate: string;
  masterListingId: number;
  offerPrice: number;
  quantity: number;
  sellerId: string;
  status: string;
  leftTimeExpire?: string;
}

export interface OfferActivities {
  action: string;
  amount: number;
  displayName: string;
  id: number;
  modifiedBy: string;
  modifiedByType: string;
  modifiedTime: string;
  offerId: number;
  quantity: number;
  margin: number;
  status: string;
}
export interface CurrentOffer {
  buyerId: string;
  buyerName: string;
  id: number;
  margin: number;
  price: number;
  status: string;
}
export interface OfferActivitiesResponse {
  activities: OfferActivities[];
  buyerId: string;
  buyerName: string;
  cogsPrice: number;
  currentListedPrice: number;
  currentOffer: CurrentOffer;
  highestOffer?: {
    price: number;
    margin: number;
    buyerName: string;
    buyerId: string;
    status: string;
    id: string;
  };
  frameSize: string;
  image: string;
  inventoryType: string;
  marketListingId: number;
  masterListingId: number;
  offerId: number;
  quantity: number;
  sellerName: string;
  sellerUserId: string;
  title: string;
  sellerStorefrontId?: string;
  listingAge?: number;
}
