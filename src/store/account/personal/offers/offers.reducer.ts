import { Action, handleActions } from 'redux-actions';
import {
  GetOfferModel,
  OffersResponse,
  OfferBikeModal,
  DetailMasterListingModal,
  GetOfferBikeModel,
  OfferActivitiesResponse,
} from 'model/api/account/personal/offers.model';
import { OffersStoreModel, OffersDetailModal } from 'model/store/account/personal/offers.model';
import { OffersPayload } from './offers.action';

const INIT_STATE: OffersStoreModel = {
  queryParams: {
    page: 1,
    size: 4,
    sort: 'DESC',
    fieldSort: 'CREATED_DATE',
  },
  queryGetBikeOffer: {
    id: null,
    sortFile: 'LAST_UPDATE',
    sortType: 'DESC',
  },
  listOffersMade: null,
  listOffersReceived: null,
  detailBikeOffers: null,
  detailOfferBuyer: null,
  listBikeOffers: null,
  offerActivities: null,
  loading: false,
};

const offersReducer = handleActions<OffersStoreModel, OffersPayload>(
  {
    GET_LIST_OFFERS_MADE: (state, action: Action<GetOfferModel>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LIST_OFFERS_MADE_SUCCEEDED: (state, action: Action<OffersResponse>) => {
      return {
        ...state,
        listOffersMade: action.payload,
        loading: false,
      };
    },
    GET_LIST_OFFERS_MADE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_LIST_OFFERS_RECEIVED: (state, action: Action<GetOfferModel>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LIST_OFFERS_RECEIVED_SUCCEEDED: (state, action: Action<OffersResponse>) => {
      return {
        ...state,
        listOffersReceived: action.payload,
        loading: false,
      };
    },
    GET_LIST_OFFERS_RECEIVED_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_DETAIL_OFFER_BUYER: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_DETAIL_OFFER_BUYER_SUCCEEDED: (state, action: Action<OffersDetailModal>) => {
      return {
        ...state,
        detailOfferBuyer: action.payload,
        loading: false,
      };
    },
    GET_DETAIL_OFFER_BUYER_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_DETAIL_OFFER_BIKE: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_DETAIL_OFFER_BIKE_SUCCEEDED: (state, action: Action<DetailMasterListingModal>) => {
      return {
        ...state,
        detailBikeOffers: action.payload,
        loading: false,
      };
    },
    GET_DETAIL_OFFER_BIKE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_LIST_OFFER_BIKE: (state, action: Action<GetOfferBikeModel>) => {
      return {
        ...state,
        queryGetBikeOffer: action.payload,
        loading: true,
      };
    },
    GET_LIST_OFFER_BIKE_SUCCEEDED: (state, action: Action<OfferBikeModal[]>) => {
      return {
        ...state,
        listBikeOffers: action.payload,
        loading: false,
      };
    },
    GET_LIST_OFFER_BIKE_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_OFFER_ACTIVITIES: (state, action: Action<string>) => {
      return {
        ...state,
        loading: true,
      };
    },
    GET_OFFER_ACTIVITIES_SUCCEEDED: (state, action: Action<OfferActivitiesResponse>) => {
      return {
        ...state,
        offerActivities: action.payload,
        loading: false,
      };
    },
    GET_OFFER_ACTIVITIES_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
  },
  INIT_STATE,
  {
    prefix: 'offers',
  },
);

export default offersReducer;
