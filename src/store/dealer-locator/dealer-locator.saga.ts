import { call, put, select, takeLatest, fork, cancel, take } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import { GetPartnerParams, ListPartnerResponse, getListPartner } from 'api/dealer-locator';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { getMessageFromError } from 'helpers/common.helper';
import * as dealerLocatorAction from './dealer-locator.action';

function* handleGetPartner(action: Action<GetPartnerParams>) {
  try {
    const response: ListPartnerResponse = yield call(getListPartner, {
      noLoading: true,
      ...action.payload,
    });
    yield put(dealerLocatorAction.getListPartnerSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(dealerLocatorAction.getListPartnerFailed(getMessageFromError(e)));
  }
}

export default function* dealerLocatorSaga() {
  yield takeLatest(dealerLocatorAction.getListPartner, handleGetPartner);
}
