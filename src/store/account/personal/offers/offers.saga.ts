import { takeLatest, put, call, select } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import t from 'helpers/language';
import omit from 'lodash/omit';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import {
  GetOfferModel,
  OffersResponse,
  UpdateOfferModel,
  ContactSellerModel,
  OfferBikeModal,
  DetailMasterListingModal,
  GetOfferBikeModel,
  OfferActivitiesResponse,
} from 'model/api/account/personal/offers.model';
import * as offerHistoryActions from 'store/store-front/offers-history/offers-history.action';
import { UpdateOfferFrom, UpdateOfferType } from 'constants/offer';
import {
  getListOffersMade,
  getDetailOffer,
  updateOffer,
  getListOffersReceived,
  contactSeller,
  getDetailOfferBike,
  getListOfferBike,
  getOfferActivities,
} from 'api/account/personal/offers.api';
import * as offerActions from './offers.action';

import StoreState from '../../../../model/store/index';
import { getMessageFromError } from '../../../../helpers/common.helper';
import cartAction from 'store/checkout/cart/cart.action';

function* handleGetListOfferMade(action: Action<GetOfferModel>) {
  try {
    const response: OffersResponse = yield call(getListOffersMade, action.payload);
    yield put(offerActions.getListOffersMadeSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getListOffersMadeFailed(getMessageFromError(error)));
  }
}

function* handleGetListOfferReceived(action: Action<GetOfferModel>) {
  try {
    const response: OffersResponse = yield call(getListOffersReceived, action.payload);
    yield put(offerActions.getListOffersReceivedSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getListOffersReceivedFailed(getMessageFromError(error)));
  }
}

function* handleDetailOfferBuyer(action: Action<string>) {
  try {
    const response: offerActions.OfferDetailSuccessPayload = yield call(getDetailOffer, action.payload);
    yield put(offerActions.getDetailOfferBuyerSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getDetailOfferBuyerFailed(getMessageFromError(error)));
  }
}

function* handleUpdateOfferBuyer(action: Action<UpdateOfferModel>) {
  try {
    const bodyParams = omit(action.payload, ['typeUpdate', 'updateFrom']);
    yield call(updateOffer, bodyParams);
    if (action.payload.updateFrom === UpdateOfferFrom.DetailOffer) {
      yield put(offerActions.getDetailOfferBuyer(action.payload.id));
    }
    if (action.payload.updateFrom === UpdateOfferFrom.MadeOffer) {
      const queryParams = yield select((store: StoreState) => store.account.personal.offers.queryParams);
      yield put(offerActions.getListOffersMade(queryParams));
    }
    if (action.payload.updateFrom === UpdateOfferFrom.ReceivedOffer) {
      const queryParams = yield select((store: StoreState) => store.account.personal.offers.queryParams);
      yield put(offerActions.getListOffersReceived(queryParams));
    }
    if (action.payload.updateFrom === UpdateOfferFrom.HistoryOffer) {
      const queryParams = yield select((store: StoreState) => store.storeFront.offersHistory.queryParams);
      yield put(offerHistoryActions.getListOffersHistory(queryParams));
    }
    if (action.payload.updateFrom === UpdateOfferFrom.DetailBike) {
      const queryParams = yield select((store: StoreState) => store.account.personal.offers.queryGetBikeOffer);
      yield put(offerActions.getListOfferBike(queryParams));
      yield put(offerActions.getDetailOfferBike(queryParams?.id));
    }
    if (action.payload.typeUpdate === UpdateOfferType.Counter) {
      toastSuccess(t('myAccount.offer.counterSuccess'));
    }
    if (action.payload.typeUpdate === UpdateOfferType.Reject) {
      toastSuccess(t('myAccount.offer.rejectSuccess'));
    }
    if (action.payload.typeUpdate === UpdateOfferType.Accept) {
      toastSuccess(t('myAccount.offer.acceptSuccess'));
    }
    if (action.payload.typeUpdate === UpdateOfferType.Cancel) {
      toastSuccess(t('myAccount.offer.cancelSuccess'));
    }
    yield put(offerActions.updateOfferBuyerSucceeded());
    const isStorefront = yield select((store: StoreState) => !!store.authenticate.user?.storefront);
    if (isStorefront) {
      yield put(offerHistoryActions.getSummaryOffersHistory());
    }
    yield put(cartAction.getCarts());
  } catch (error) {
    toastError(error);
    yield put(offerActions.updateOfferBuyerFailed(getMessageFromError(error)));
  }
}

function* handleContactSeller(action: Action<ContactSellerModel>) {
  try {
    yield call(contactSeller, action.payload);
    toastSuccess('Message sent');
  } catch (error) {
    toastError(error);
    yield put(offerActions.contactSellerFailed(getMessageFromError(error)));
  }
}

function* handleGetDetailOfferBike(action: Action<string>) {
  try {
    const response: DetailMasterListingModal = yield call(getDetailOfferBike, action.payload);
    yield put(offerActions.getDetailOfferBikeSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getDetailOfferBikeFailed(getMessageFromError(error)));
  }
}

function* handleGetListOfferBike(action: Action<GetOfferBikeModel>) {
  try {
    const response: OfferBikeModal[] = yield call(getListOfferBike, action.payload);
    yield put(offerActions.getListOfferBikeSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getListOfferBikeFailed(getMessageFromError(error)));
  }
}
function* handleOfferActivities(action: Action<string>) {
  try {
    const response: OfferActivitiesResponse = yield call(getOfferActivities, action.payload);
    yield put(offerActions.getOfferActivitiesSucceeded(response));
  } catch (error) {
    toastError(error);
    yield put(offerActions.getOfferActivitiesFailed(getMessageFromError(error)));
  }
}

export default function* offersSaga() {
  yield takeLatest(offerActions.getListOffersMade, handleGetListOfferMade);
  yield takeLatest(offerActions.getListOffersReceived, handleGetListOfferReceived);
  yield takeLatest(offerActions.getDetailOfferBuyer, handleDetailOfferBuyer);
  yield takeLatest(offerActions.updateOfferBuyer, handleUpdateOfferBuyer);
  yield takeLatest(offerActions.contactSeller, handleContactSeller);
  yield takeLatest(offerActions.getDetailOfferBike, handleGetDetailOfferBike);
  yield takeLatest(offerActions.getListOfferBike, handleGetListOfferBike);
  yield takeLatest(offerActions.getOfferActivities, handleOfferActivities);
}
