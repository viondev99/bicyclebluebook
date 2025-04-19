import { createActions } from 'redux-actions';
import { OffersDetailModal } from 'model/store/account/personal/offers.model';
import {
  GetOfferModel,
  OffersResponse,
  UpdateOfferModel,
  ContactSellerModel,
  ContactSellerResponse,
  OfferBikeModal,
  GetOfferBikeModel,
  DetailMasterListingModal,
  OfferActivitiesResponse,
} from 'model/api/account/personal/offers.model';

export type OfferDetailSuccessPayload = OffersDetailModal;
export type OfferBikeSuccessPayload = OfferBikeModal[];

export type OffersPayload =
  | GetOfferModel
  | OffersResponse
  | string
  | OfferDetailSuccessPayload
  | UpdateOfferModel
  | ContactSellerModel
  | ContactSellerResponse
  | OfferBikeSuccessPayload
  | DetailMasterListingModal
  | GetOfferBikeModel
  | OfferActivitiesResponse;

export const {
  getListOffersMade,
  getListOffersMadeSucceeded,
  getListOffersMadeFailed,
  getListOffersReceived,
  getListOffersReceivedSucceeded,
  getListOffersReceivedFailed,
  getDetailOfferBuyer,
  getDetailOfferBuyerSucceeded,
  getDetailOfferBuyerFailed,
  updateOfferBuyer,
  updateOfferBuyerSucceeded,
  updateOfferBuyerFailed,
  contactSeller,
  contactSellerSucceeded,
  contactSellerFailed,
  getDetailOfferBike,
  getDetailOfferBikeSucceeded,
  getDetailOfferBikeFailed,
  getListOfferBike,
  getListOfferBikeSucceeded,
  getListOfferBikeFailed,
  getOfferActivities,
  getOfferActivitiesSucceeded,
  getOfferActivitiesFailed,
} = createActions<OffersPayload>(
  {
    GET_LIST_OFFERS_MADE: (payload: GetOfferModel) => payload,
    GET_LIST_OFFERS_MADE_SUCCEEDED: (payload: OffersResponse) => payload,
    GET_LIST_OFFERS_MADE_FAILED: null,
    GET_LIST_OFFERS_RECEIVED: (payload: GetOfferModel) => payload,
    GET_LIST_OFFERS_RECEIVED_SUCCEEDED: (payload: OffersResponse) => payload,
    GET_LIST_OFFERS_RECEIVED_FAILED: null,
    GET_DETAIL_OFFER_BUYER: (payload: string) => payload,
    GET_DETAIL_OFFER_BUYER_SUCCEEDED: (payload: OfferDetailSuccessPayload) => payload,
    GET_DETAIL_OFFER_BUYER_FAILED: null,
    UPDATE_OFFER_BUYER: (payload: UpdateOfferModel) => payload,
    UPDATE_OFFER_BUYER_SUCCEEDED: (payload: string) => payload,
    UPDATE_OFFER_BUYER_FAILED: null,
    CONTACT_SELLER: (payload: ContactSellerModel) => payload,
    CONTACT_SELLER_SUCCEEDED: (payload: ContactSellerResponse) => payload,
    CONTACT_SELLER_FAILED: null,
    GET_DETAIL_OFFER_BIKE: (payload: string) => payload,
    GET_DETAIL_OFFER_BIKE_SUCCEEDED: (payload: DetailMasterListingModal) => payload,
    GET_DETAIL_OFFER_BIKE_FAILED: null,
    GET_LIST_OFFER_BIKE: (payload: GetOfferBikeModel) => payload,
    GET_LIST_OFFER_BIKE_SUCCEEDED: (payload: OfferBikeSuccessPayload) => payload,
    GET_LIST_OFFER_BIKE_FAILED: null,
    GET_OFFER_ACTIVITIES: (payload: string) => payload,
    GET_OFFER_ACTIVITIES_SUCCEEDED: (payload: OfferActivitiesResponse) => payload,
    GET_OFFER_ACTIVITIES_FAILED: null,
  },
  {
    prefix: 'offers',
  },
);
