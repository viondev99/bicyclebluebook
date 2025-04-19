import { createActions } from 'redux-actions';
import {
  GetOfferHistoryModel,
  GetOfferSummaryModel,
  OffersHistoryResponse,
} from 'model/api/store-front/offers-history.model';

export type OffersHistoryPayload = GetOfferHistoryModel | OffersHistoryResponse | number | GetOfferSummaryModel;

export const {
  getListOffersHistory,
  getListOffersHistorySucceeded,
  getListOffersHistoryFailed,
  getSummaryOffersHistory,
  getSummaryOffersHistorySucceeded,
  getSummaryOffersHistoryFailed,
} = createActions<OffersHistoryPayload>(
  {
    GET_LIST_OFFERS_HISTORY: (payload: GetOfferHistoryModel) => payload,
    GET_LIST_OFFERS_HISTORY_SUCCEEDED: (payload: OffersHistoryResponse) => payload,
    GET_LIST_OFFERS_HISTORY_FAILED: null,
    GET_SUMMARY_OFFERS_HISTORY: (payload: GetOfferSummaryModel) => payload,
    GET_SUMMARY_OFFERS_HISTORY_SUCCEEDED: (payload: number) => payload,
    GET_SUMMARY_OFFERS_HISTORY_FAILED: null,
  },
  {
    prefix: 'offers-history',
  },
);
