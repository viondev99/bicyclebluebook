import { takeLatest, put, call } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { toastError } from 'helpers/utils.helper';
import { getMessageFromError } from 'helpers/common.helper';
import {
  GetOfferHistoryModel,
  GetOfferSummaryModel,
  OffersHistoryResponse,
} from 'model/api/store-front/offers-history.model';
import { getListOffersHistory, getOfferSummary, OfferSummaryResponse } from 'api/store-front/offers-history.api';
import * as offerActions from './offers-history.action';

function* handleGetListOfferHistory(action: Action<GetOfferHistoryModel>) {
  try {
    const response: OffersHistoryResponse = yield call(getListOffersHistory, {
      page: action.payload.page || 1,
      size: action.payload.size || 10,
      fromDay: action.payload?.fromDay,
      content: action.payload?.content,
      toDay: action.payload?.toDay,
      statuses: action.payload?.statuses,
      storefrontIds: action?.payload?.storefrontIds,
    });
    yield put(offerActions.getListOffersHistorySucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getListOffersHistoryFailed(getMessageFromError(error)));
  }
}

function* handleGetSummaryOffersHistory(action: Action<GetOfferSummaryModel>) {
  try {
    const response: OfferSummaryResponse = yield call(getOfferSummary, {
      storefrontIds: action?.payload?.storefrontIds,
    });
    yield put(offerActions.getSummaryOffersHistorySucceeded(response.openOffers));
  } catch (e) {
    console.log(e);
    yield put(offerActions.getSummaryOffersHistoryFailed());
  }
}

export default function* offersHistorySaga() {
  yield takeLatest(offerActions.getListOffersHistory, handleGetListOfferHistory);
  yield takeLatest(offerActions.getSummaryOffersHistory, handleGetSummaryOffersHistory);
}
