import {
  OffersResponse,
  GetOfferModel,
  OfferBikeModal,
  DetailMasterListingModal,
  GetOfferBikeModel,
  OfferActivitiesResponse,
} from 'model/api/account/personal/offers.model';

export interface OffersStoreModel {
  queryParams: GetOfferModel;
  queryGetBikeOffer: GetOfferBikeModel;
  listOffersMade: OffersResponse;
  listOffersReceived: OffersResponse;
  detailOfferBuyer: OffersDetailModal;
  listBikeOffers: OfferBikeModal[];
  detailBikeOffers: DetailMasterListingModal;
  offerActivities: OfferActivitiesResponse;
  loading: boolean;
}

export interface Activity {
  action: string;
  amount: number;
  displayName: string;
  id: number;
  margin: number;
  modifiedBy: string;
  modifiedByType: string;
  modifiedTime: Date | string;
  offerId: number;
  quantity: number;
  status: string;
  sellerStorefrontId?: string;
  sellerUserId?: string;
  leftTimeExpire?: string;
  modifiedByName?: string;
  message?: string;
}

export interface CurrentOffer {
  buyerId: string;
  buyerName: string;
  id: number;
  price: number;
  status: string;
  margin?: number;
}

export interface OffersDetailModal {
  activities: Activity[];
  buyerId: string;
  buyerName: string;
  cogsPrice: number;
  currentListedPrice: number;
  currentOffer: CurrentOffer;
  frameSize: string;
  image: string;
  marketListingId: number;
  masterListingId: number;
  offerId: number;
  profit: { itemCost: number; shippingFee: number; paypalFeePercent: number; paypalFeeFixedAmount: number };
  quantity: number;
  sellerName: string;
  sellerStorefrontId: string;
  sellerUserId: string;
  title: string;
  leftTimeExpire?: string;
  inventoryType?: string;
  listingAge?: number;
  margin?: number;
  inventoryName?: string;
}
