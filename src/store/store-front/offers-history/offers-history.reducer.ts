import { Action, handleActions } from 'redux-actions';
import { GetOfferHistoryModel, OffersHistoryResponse } from 'model/api/store-front/offers-history.model';
import { OffersHistoryStoreModel } from 'model/store/store-front/offers-history.model';
import { OffersHistoryPayload } from './offers-history.action';

const INIT_STATE: OffersHistoryStoreModel = {
  queryParams: {
    page: 1,
    size: 3,
  },
  listOffersHistory: null,
  summaryOffers: 0,
  loading: false,
};

const offersHistoryReducer = handleActions<OffersHistoryStoreModel, OffersHistoryPayload>(
  {
    GET_LIST_OFFERS_HISTORY: (state, action: Action<GetOfferHistoryModel>) => {
      return {
        ...state,
        loading: true,
        queryParams: action.payload,
      };
    },
    GET_LIST_OFFERS_HISTORY_SUCCEEDED: (state, action: Action<OffersHistoryResponse>) => {
      return {
        ...state,
        listOffersHistory: action.payload,
        loading: false,
      };
    },
    GET_LIST_OFFERS_HISTORY_FAILED: (state) => {
      return {
        ...state,
        loading: false,
      };
    },
    GET_SUMMARY_OFFERS_HISTORY: (state) => {
      return { ...state, summaryOffers: 0 };
    },
    GET_SUMMARY_OFFERS_HISTORY_SUCCEEDED: (state, action: Action<number>) => {
      return { ...state, summaryOffers: action.payload };
    },
    GET_SUMMARY_OFFERS_HISTORY_FAILED: (state) => {
      return { ...state };
    },
  },
  INIT_STATE,
  {
    prefix: 'offers-history',
  },
);

export default offersHistoryReducer;
